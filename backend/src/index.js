const express = require('express');
const cors = require('cors');
const postRoutes = require('./routes/posts');
const dotenv = require('dotenv').config();
const authRoutes = require('./routes/auth');
const likesCommentsRoutes = require('./routes/likesComments');

const app = express();
const PORT = process.env.PORT || 3001;


// Middlewares
app.use(cors());
app.use(express.json({ limit: '30mb' }));
app.use('/uploads', express.static('uploads'));

//Routes
app.use('/api/posts', postRoutes);
//app.use('/api/profile', profileRoutes);
app.use('/api', authRoutes);
app.use('/api', likesCommentsRoutes);

app.get("/",(req,res)=>{
  res.send("Server is ready")
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log('Servidor ejecutandose pai');
});
