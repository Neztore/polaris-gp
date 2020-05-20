[![Polaris GP Badge](https://img.shields.io/badge/Polaris-Group%20promotion-2bbbad.svg)](https://polaris.codes)

# About
This is the Open source repository for our Group promotion system.
It allows you to promote users to various ranks based o their rank in 'sub groups', for example departments.
Examples are included in the examples directory.

# How to use
You will need to run the server on a VPS or something like Glitch. Then you can either take the code from the `source` directory, or alternatively make use of an example game from the `examples` folder.

## Settings information
This server was originally intended to be used for a group promotion service. As a result, it supports serving multiple different centres from one process.
Most likely you will only require one centre.
Rank configuration is done within the client. The server only takes a valid authentication key set and ranks people.

#### Settings values
| Name  | Type | Value |
| ------------- | ------------- | ------------- |
| **centres** | Object | with keys of centre names. Each key then contains another object.  |
| CENTRE_NAME  | Object | with values "auth" and "groups" which are arrays.  |
| centres.NAME.auth | Array of string |Array of auth tokens. Each should be long, complex and random. I suggest using this [tool](https://passwordsgenerator.net/).
| centres.NAME.groups  | Array of number | Array of group ids. They must be given as a number.  |
| securityToken  | string | A global security token. This is less important than centre specific tokens and can be left to default. |
| port  | Number | Port number to listen on  |
| cookie  | String | Your Roblox account cookie. Called .`ROBLOSECURITY`. Include the warning.  |
#### Example configuration
```JSON
{
  "centres": {
    "CENTRE_NAME": {
      "auth": [ 
        "AUTH_KEY_1", "AUTH_KEY_2"
      ],
      "groups": [
        1,
        2
      ]
    }
  },
  "securityToken": "POLARIS_RANK_SYSTEM_2KEn",
  "port": 40,
  "cookie": ""
}
```
If using the example included in the `examples` folder, ensure you add the centre's base url in MainModule/http and if modified, the security token.

#### About authentication
You will notice there are two tokens. The securityToken is not really required as it was included as a global token for when this module was used to provide a service.
However, modifying will make your authentication header harder to read, so while changing is not required - it isn't a bad idea to do so.
It's counterpart is stored within the module script for the included example.

The authentication scheme is that tokens are included in the `Authentication` header, as `GLOBAL_TOKEN:CENTRE_TOKEN`.

You can check out the Module under the `source` directory. 
## How did you export a Roblox model?
I used the tiny module [rbx-export](https://github.com/Neztore/rbx-export), created by yours truly, which is available on NPM.

# Getting help
If you need help, join the [Polaris discord](https://discord.gg/QevWabU). You can get help with Bloxy [here](https://discord.gg/EDXNdAT).
