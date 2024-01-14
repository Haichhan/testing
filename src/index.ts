import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import { getPrismaInstant, measureTime } from './util/prisma'
dotenv.config();
const app = express();
app.use(cors({
  origin:"*"
}))
const port = process.env.PORT;

const prisma = getPrismaInstant()

app.use(measureTime)

app.get('/', async (req, res) => {
  const users = await prisma.user.findMany({
    select:{
      id:true,
      username:true,
      email:true,
      post:true
    },
    take:1000
  })
  return res.json(users)
});

app.post("/post",async(req,res)=>{
  try {
    for (let i = 0; i < 1000000; i++) {
      await prisma.user.create({
        data: {
          username: `User ${i + 1}`,
          email: `user${i + 1}@example.com`,
        },
      });
    }
    return res.status(201).send('Data generation completed.');
  } catch (error) {
    return res.status(500).send('Error generating data:');
  } finally {
    await prisma.$disconnect();
  }
})

app.post("/posting",async(req,res)=>{
  try {
    for (let i = 0; i < 1000000; i++) {
      const randomImage = `https://lorempixel.com/200/200/people/${i + 1}/`;
      await prisma.post.create({
        data: {
          category: `User ${i + 1}`,
          title: `user${i + 1}@example.com`,
          likes:i,
          images:randomImage,
          user:{connect:{id:i+1}}
        },
      });
    }
    return res.status(201).send('Data generation completed.');
  } catch (error) {
    return res.status(500).send('Error generating data:');
  } finally {
    await prisma.$disconnect();
  }
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});