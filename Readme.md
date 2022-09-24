# A Simple 2fa server with nodejs


[X] POST */api/register*
### Reponse Body
    {
        user_id: string
        secret: string
    }


[X] POST */api/verify*
### Request Body
    {
        userID: string
        token: string
    }

### Reponse Body ---> [successful]
    {
        verified: true
    }

### Response Body ---> [Failed]
    {
        verified: false
    }


