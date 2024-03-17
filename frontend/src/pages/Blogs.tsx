import { Appbar } from "../components/Appbar"
import { BlogCard } from "../components/BlogCard"
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useBlogs } from "../components/hooks";


export const Blogs=()=>{
    const {loading,blogs}=useBlogs();
    if(loading){
        return<div className="flex justify-center">
            <BlogSkeleton/>
            <BlogSkeleton/>
            <BlogSkeleton/>
        </div>
    }
    return <div> 
    <Appbar/>
    <div className="flex justify-center">
    <div className="max-w-xl ">
        {blogs.map(blog=> <BlogCard 
        id={blog.id}
        authorName={blog.author.name || "Anonymous"}
        title={blog.title}
        content={blog.content}
        publishedDate={"2nd feb 2024"}/>)}
        
    </div>
    </div>
    </div>
}