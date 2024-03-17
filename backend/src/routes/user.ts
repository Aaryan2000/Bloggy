import {Hono} from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {decode,sign,verify} from 'hono/jwt'
import { signupInput,signinInput } from "@100xdevs/medium-common";

export const userRouter=new Hono<{
Bindings:{//it represent what c.env(environment variable) will contain if we are not writing Bindings then error comes in c.env. environment variable of user.ts is present in wrangler.toml
    DATABASE_URL:string;
    JWT_SECRET:string;
}
}>();

userRouter.post('/signup',async(c)=>{//c variable is context variable which contain all your request data,all your response data,all your environment variable,.... 10 diff things
    const prisma = new PrismaClient({ //these 3 lines are written in every route and not written globally becoz in that 3 line c(context) is also present which is not possible for me to access from outside
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
  
    const body=await c.req.json();//while converting data in json await is used becoz it return a promise
    const {success}=signupInput.safeParse(body);
    if(!success){
        c.status(411);
        return c.json({
            message:"Inputs not correct"
        }) 
    }

    try{
    const user=await prisma.user.create({
      data:{
        email:body.username,
        password:body.password,
        name:body.name
      }
    });
    const token=await sign({id:user.id},c.env.JWT_SECRET);
    return c.json({
     token
    })
  }catch(e){
    console.log(e);
    c.status(403);
    return c.text('Invalid')
  }
  })
  
  
  userRouter.post('/signin',async(c)=>{
    const prisma=new PrismaClient({
      datasourceUrl:c.env?.DATABASE_URL
    }).$extends(withAccelerate());
    const body=await c.req.json();
    const {success}=signinInput.safeParse(body)
    if(!success){
        c.status(411);
        return c.json({
            message:"Inputs not correct"
        }) 
    }
    try{
    const user=await prisma.user.findUnique({
      where:{
        email:body.username,
        password:body.password
      }
    });
    if(!user){
      c.status(403);//403 status code we used when sending wrong credential
      return c.json({error:"user not found so please send correct credential"});
    }
    const jwt=await sign({id:user.id},c.env.JWT_SECRET);
    return c.json({jwt});
  }catch(e){
    console.log(e);
    c.status(411);
    return c.text('Invalid')
    
  }
  })
