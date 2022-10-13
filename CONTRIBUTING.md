Please see the Issues Tab for what to do.<br />
---
### Porting Support for other Colleges
If you want to add support for more colleges to Parser, please make a new <collegeName>Parser() function for your college and make a PR. Follow the #Run intructions in main for how to that.
---
### Tasks Left
- implement proper handling to prevent the frequent crashes (try catch)
    - remove all console logs
    - wrap main.js in startBot() function and call startBot() in all catch blocks to start bot again after crashes