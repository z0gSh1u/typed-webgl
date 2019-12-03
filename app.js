const express = require('express')
const app = express()
app.use(express.static('./', {
    maxAge: 0,
    setHeaders: (res, path, stat) => {
        res.set('Cache-Control', 'nocache')
        res.set('Pragma', 'nocache')
        res.set('Expires', '-1')
    }
}))
app.listen(8081)
console.log('Listening 8081 port.')