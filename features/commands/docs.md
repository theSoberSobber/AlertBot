# Message Object API docs
Please use the below cheatsheet to write your own functions for the command handler. <br>
```js
NOTE that here 
messageObj = chatUpdate.messages[0];
where chatUpdate is passed by main.js upsert event.
```

- key
  - remoteJid : sender JID : string
  - fromMe : bool
  - id : messageId : string
  - participant : string or undefined
    - DM : undefined
    - groupMessage : string : sender JID
- messageTimestamp : long integer
- pushName : name_of_sender : string
- message : object
  - if: 
    - text :
      - conversation : string
    - text_with_tag:
      - extendedTextMessage: object
        - text : string
        - contextInfo : object
    - video:
      - videoMessage : object
        - url : string
        - mimetype : 'video/mp4'
        - seconds : integer
        - height : integer
        - width : integer
        - caption
        - contextInfo : object
    - image:
      - imageMessage : object
        - url : string
        - mimetype : 'image/jpeg'
        - caption
        - contextInfo : object
  - messageContextInfo : object
    - deviceListMetadata : object
    - deviceListMetadataVersion : integer