
import TwedsCard from "@/components/cards/TwedsCard";
import { fetchPosts } from "@/lib/actions/twed.actions";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {

  const result = await fetchPosts(1, 20);
  const user = await currentUser();

  return (
    <>
      <h1 className='head-text text-left'>Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {

          result.posts.length === 0 ? (
            <p className="no-result" >No Tweds found</p>
          ) : (
            <>
              {
                result.posts.map((post) => (
                  <TwedsCard
                    key={post._id}
                    id={post._id}
                    currentUserId={user?.id || ""}
                    parentId={post.parentId}
                    content={post.text}
                    author={post.author}
                    community={post.community}
                    createdAt={post.createdAt}
                    comments={post.children}
                  />
                ))
              }
            </>
          )
        }
      </section>
    </>
  )
} 