import fs from "fs";
import { blue, green, red, reset, yellow } from "kolorist";
import minimist from "minimist";
import path from "path";
import prompts from "prompts";
import { copy, emptyDir, isEmpty, renameFiles } from "./fileutils";
import { formatTargetDir, kebabCase } from "./formatters";
import { isValidGlasscockpitID } from "./glasscockpitutils";
import { isValidPackageName, toValidPackageName } from "./pkgutils";

const argv = minimist<{
  t?: string;
  template?: string;
}>(process.argv.slice(2), { string: ["_"] });

const cwd = process.cwd();

type ColorFunc = (str: string | number) => string;

type Framework = {
  name: string;
  display: string;
  color: ColorFunc;
  variants: FrameworkVariants[];
};

type FrameworkVariants = {
  name: string;
  display: string;
  color: ColorFunc;
};

const FRAMEWORKS: Framework[] = [
  {
    name: "vanilla",
    display: "Vanilla",
    color: yellow,
    variants: [
      {
        name: "vanilla-ts",
        display: "Typescript",
        color: blue,
      },
      {
        name: "vanilla",
        display: "Javascript",
        color: yellow,
      },
    ],
  },
  {
    name: "msfs-sdk",
    display: "MSFS SDK",
    color: green,
    variants: [
      {
        name: "msfs-sdk-ts",
        display: "Typescript",
        color: blue,
      },
      {
        name: "msfs-sdk",
        display: "Javascript",
        color: yellow,
      },
    ],
  },
];

const TEMPLATES = FRAMEWORKS.map(
  (framework) =>
    (framework.variants && framework.variants.map((value) => value.name)) || [framework.name]
).reduce((a, b) => a.concat(b), []);

const defaultTargetDir = "msfs-glasscockpit";

async function init() {
  const argTargetDir = formatTargetDir(argv._[0]);
  const argTemplate = argv.template || argv.t;

  let targetDir = argTargetDir || defaultTargetDir;

  const getProjectName = () => (targetDir === "." ? path.basename(path.resolve()) : targetDir);

  let result: prompts.Answers<
    "projectName" | "overwrite" | "framework" | "variant" | "packageName" | "glasscockpitID"
  >;

  try {
    result = await prompts(
      [
        {
          type: argTargetDir ? null : "text",
          name: "projectName",
          message: reset("Project name:"),
          initial: defaultTargetDir,
          onState: (state) => {
            targetDir = formatTargetDir(state.value) || defaultTargetDir;
          },
        },
        {
          type: () => (!fs.existsSync(targetDir) || isEmpty(targetDir) ? null : "select"),
          name: "overwrite",
          message: () =>
            targetDir === "."
              ? "Current directory"
              : `Target directory ${targetDir} is not empty. Please choose how to proceed:`,
          initial: 0,
          choices: [
            { title: "Remove existing files and continue", value: "yes" },
            { title: "Cancel operation", value: "no" },
            { title: "Ignore files and continue", value: "ignore" },
          ],
        },
        {
          type: (_, { overwrite }: { overwrite?: string }) => {
            if (overwrite === "no") {
              throw new Error(red("✖") + " Operation cancelled");
            }
            return null;
          },
          name: "overwriteChecker",
        },
        {
          type: () => (isValidPackageName(getProjectName()) ? null : "text"),
          name: "packageName",
          message: reset("Package name:"),
          initial: () => toValidPackageName(getProjectName()),
          validate: (value) => isValidPackageName(value) || "Invalid package.json name",
        },
        {
          type: () => (argTemplate && TEMPLATES.includes(argTemplate) ? null : "select"),
          name: "framework",
          message:
            typeof argTemplate === "string" && !TEMPLATES.includes(argTemplate)
              ? reset(`Invalid template: ${argTemplate}. Please choose from below:`)
              : reset("Select a framework:"),
          initial: 0,
          choices: FRAMEWORKS.map((framework) => ({
            title: framework.color(framework.display || framework.name),
            value: framework,
          })),
        },
        {
          type: (framework: Framework) => (framework && framework.variants ? "select" : null),
          name: "variant",
          message: reset("Select a variant:"),
          choices: (framework: Framework) =>
            framework.variants.map((variant) => ({
              title: variant.color(variant.display || variant.name),
              value: variant.name,
            })),
        },
        {
          name: "glasscockpitID",
          type: "text",
          message: reset("Select a glasscockpit ID:"),
          initial: () => getProjectName(),
          validate: (value) => isValidGlasscockpitID(value) || "Invalid Glasscockpit ID",
        },
      ],
      {
        onCancel: () => {
          throw new Error(red("✖") + " Operation cancelled");
        },
      }
    );
  } catch (cancelled: any) {
    console.log(cancelled.message);
    return;
  }

  const { framework, overwrite, packageName, variant, glasscockpitID } = result;

  const root = path.join(cwd, targetDir);

  if (overwrite === "yes") {
    emptyDir(root);
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true });
  }

  let template: string = variant || framework?.name || argTemplate;

  console.log(`\nScaffolding project in ${root}...`);

  const templateDir = path.resolve(__dirname, "../templates", `template-${template}`);

  const write = (file: string, content?: string) => {
    const targetPath = path.join(root, renameFiles[file] ?? file);
    if (content) {
      fs.writeFileSync(targetPath, content);
    } else {
      copy(path.join(templateDir, file), targetPath);
    }
  };

  const files = fs.readdirSync(templateDir);

  for (const file of files) {
    write(file);
  }

  // Edit package.json
  const pkg = JSON.parse(fs.readFileSync(path.join(targetDir, `package.json`), "utf-8"));

  pkg.name = packageName || getProjectName();

  write("package.json", JSON.stringify(pkg, null, 2) + "\n");

  // Edit main.*
  const mainFiles = fs
    .readdirSync(path.join(targetDir, "src"))
    .filter((file) => file.startsWith("main."));
  for (const mainFile of mainFiles) {
    const main = fs.readFileSync(path.join(targetDir, `src/${mainFile}`), "utf-8");

    write(
      `src/${mainFile}`,
      main
        .replace(/glasscockpitID/g, glasscockpitID)
        .replace(/glasscockpit-id/g, kebabCase(glasscockpitID))
    );
  }

  // Edit index.html
  const indexHTML = fs.readFileSync(path.join(targetDir, "src/index.html"), "utf-8");

  write("src/index.html", indexHTML.replace(/glasscockpitID/g, glasscockpitID));

  const cdProjectName = path.relative(cwd, root);
  console.log(`\nDone. Now run:\n`);
  if (root !== cwd) {
    console.log(`  cd ${cdProjectName.includes(" ") ? `"${cdProjectName}"` : cdProjectName}`);
  }

  console.log(`  npm install`);
  console.log(`  npm run dev`);
  console.log();
}

init().catch((e) => {
  console.error(e);
  process.exit(1);
});
