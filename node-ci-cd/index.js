const express = require('express');

const app = express();

app.get('/',(req,res)=>{
    return res.status(200).json({message:'Hello World !'});
})

app.get('/users',(req,res)=>{
    const users = [
        {id:1,name:'Jone Doe'},
        {id:2,name:'Pavan Doe'},
        {id:3,name:'Surya Doe'},
        {id:4,name:'Ashish Doe'},
        {id:5,name:'Karimnagar Doe'},
    ]

    return res.status(200).json({users});
})


app.listen(4000,()=>{
    console.log('Server is running on port 4000');
})