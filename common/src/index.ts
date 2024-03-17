import z from "zod"

//these variable is required by backend
export const signupInput=z.object({
    email:z.string().email(),
    password:z.string().min(6),
    name:z.string().optional()
})

//type inference in :frontend require these type inference
export type SignupInput=z.infer<typeof signupInput>


export const signinInput=z.object({
    email:z.string().email(),
    password:z.string().min(6)
})

//type inference in zod
export type SigninInput=z.infer<typeof signupInput>



export const createBlogInput=z.object({
    title:z.string(),
    content:z.string()
})

//type inference in zod
export type CreateBlogInput=z.infer<typeof createBlogInput>


export const updateBlogInput=z.object({
    title:z.string(),
    content:z.string(),
    id:z.number()
})

//type inference in zod
export type UpdateBlogInput=z.infer<typeof updateBlogInput>
