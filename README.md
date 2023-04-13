# Alert Bot
---
### Run - 
- git clone
- 'yarn'/'yarn install'
- generate a session file from https://github.com/theSoberSobber/Whatsapp-Bot-Template
    - put it in the root folder (./sesi.json)
- 'yarn production' or 'yarn dev'

---
***NOTE***- You must have NODE version 18 and NOT LTS to run this bot. (because of fetch api) <br />
(use nvm btw)

---
### Deployment
- Please refer to [this](./FUTURE.md) document for the new architecture proposal.
- Vercel doesn't support websockets otherwise all functions are pretty RESTful.
- for deplying https://github.com/theSoberSobber/Groups-AlertBot can be clubbed into one project since they don't have any conflicting parts. Just include the group.js and info.json file in the features folder then import and call it in main.js after the 'connection open' event has occured.
---
### Contributing
Please see the [Contribution](./CONTRIBUTING.md) file before starting on anything. <br />
Please follow the structure of the project and your pull will surely be accepted. Thanks again!