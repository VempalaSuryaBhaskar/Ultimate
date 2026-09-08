const express = require('express');

const app = express();

const users = [
    { id: 1, name: 'Jone Doe' },
    { id: 2, name: 'Pavan Doe' },
    { id: 3, name: 'Surya Doe' },
    { id: 4, name: 'Ashish Doe' },
    { id: 5, name: 'Karimnagar Doe' },
]

app.get('/', (req, res) => {
    return res.status(200).json({ message: 'Hello World !' });
})

app.get('/users', (req, res) => {
    return res.status(200).json({ users });
})


//commented the below code to test the CI/CD pipeline
app.get('/users/:id',(req,res)=>{
    const userId = parseInt(req.params.id);

    const user = users.find(u => u.id === userId);
    
    if(!user){
        return res.status(404).json({ message: 'User not found'});
    }
    return res.status(200).json({ user });
})

app.listen(4000, () => {
    console.log('Server is running on port 4000');
})