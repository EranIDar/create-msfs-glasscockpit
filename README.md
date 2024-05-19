# create-msfs-glasscockpit

We recommend to init your glasscockpit in your Microsoft Flight Simulator package source.
Your package isn't created yet? Learn how to do it [here](https://docs.flightsimulator.com/html/mergedProjects/How_To_Make_An_Aircraft/Contents/Instruments/Setting_Up_For_HTML_Instruments.htm)

Then run:

```bash
$ npm create msfs-glasscockpit@latest
```

Then, you can choose between several templates:

- `vanilla`
- `vanilla typescript`
- `msfs-sdk `
- `msfs-sdk typescript`

You can set the following parameters:

|         parameter | mandatory |              defaults to |                                           description |
| ----------------: | --------: | -----------------------: | ----------------------------------------------------: |
|      Project name |       Yes |        msfs-glasscockpit | the folder name where the template is gonna be copied |
|      Package name |       Yes | project name kebab cased |          the package name inside of your package.json |
|         Framework |       Yes |                      N/A |                            your privilegied framework |
| Framework variant |  -------- |                      N/A |                                    typechecked or not |
|   Glasscockpit ID |  -------- | project name kebab cased |      the glasscockpit identifier within your template |

---

_This project is largely inspired by the [create-vite package](https://www.npmjs.com/package/create-vite) ❤️_
