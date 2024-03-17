import { PrismaClient } from "@prisma/client/edge";
import {Hono} from "hono"
import { withAccelerate } from '@prisma/extension-accelerate'
import {decode,sign,verify} from 'hono/jwt'
import {createBlogInput,updateBlogInput} from "@100xdevs/medium-common"

export const blogRouter=new Hono<{
    Bindings:{
        DATABASE_URL:string;
        JWT_SECRET:string;
    },
    Variables:{
        userId:string;//if not writing these line then error came in c.set("userId") see below
    }

}>();


//Middleware
blogRouter.use('/*',async(c,next)=>{
//extract user id
//pass it down to the router

const authHeader=c.req.header("authorizations") || ""; //here we write becoz if authorization doesn't contain token then "" goes to authHeader
try{
const user=await verify(authHeader,c.env.JWT_SECRET);
if(user){
    c.set("userId",user.id);
    await next();
}else{
    c.status(403);
    return c.json({
        message:"You are not Logged in"
    })
 }
}catch(e){
    c.status(403);
    return c.json({
        message:"wrong jwt"
    })
}
});


blogRouter.post('/',async(c)=>{
    const prisma=new PrismaClient({
        datasourceUrl:c.env?.DATABASE_URL
      }).$extends(withAccelerate());
    
    const body=await c.req.json();
    const {success}=createBlogInput.safeParse(body)
    if(!success){
        c.status(411);
        return c.json({
            message:"Inputs not correct"
        }) 
    }
    const authorId=c.get("userId")
    
    const blog=await prisma.post.create({
        data:{
            title:body.title,
            content:body.content,
            authorId:authorId
        }
    })

    return c.json({
        id:blog.id
    })
  })
  
  blogRouter.put('/',async(c)=>{
    const prisma=new PrismaClient({
        datasourceUrl:c.env?.DATABASE_URL
      }).$extends(withAccelerate());
    const body=await c.req.json();
    const {success}=updateBlogInput.safeParse(body)
    if(!success){
        c.status(411);
        return c.json({
            message:"Inputs not correct"
        }) 
    }
    const blog=await prisma.post.update({
        where:{
            id:body.id
        },
        data:{
            title:body.title,
            content:body.content,
        }
    })

    return c.json({
        id:blog.id
    })
  
  })


  blogRouter.get('/bulk',async(c)=>{
    const prisma=new PrismaClient({
        datasourceUrl:c.env?.DATABASE_URL
      }).$extends(withAccelerate());
    const blogs=await prisma.post.findMany({
        select:{
            content:true,
            title:true,
            id:true,
            author:{
                select:{
                    name:true
                }
            }
        }
    });
console.log(blogs);

    return c.json({
        blogs
    })
  })

  
  blogRouter.get('/:id',async(c)=>{
    const id=c.req.param("id");
    const prisma=new PrismaClient({
        datasourceUrl:c.env?.DATABASE_URL
      }).$extends(withAccelerate());

    try{
        const blog=await prisma.post.findFirst({
            where:{
                id:id
            },
            select:{
                id:true,
                title: true,
                content: true,
                author:{
                    select:{
                    name:true
                   }                
               }
            }
        })
        return c.json({
            blog
        });
    }catch(e){
        c.status(411);
        return c.json({
            message:"Error while fetching blog post"
        });
    }
  })
  
