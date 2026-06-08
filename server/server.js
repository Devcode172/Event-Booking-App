const app = require('./app')
require("dotenv").config()
app.listen(process.env.PORT,(err)=>{
    if(err) console.log(err)
    else
    console.log(`Server is runnung on port ${process.env.PORT}`)
})