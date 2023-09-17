import TwedsCard from "@/components/cards/TwedsCard"
import Comments from "@/components/forms/Comments";
import { fetchTwedsById } from "@/lib/actions/twed.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {

    if (!params) return null;

    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect("/onboarding");

    const tweds = await fetchTwedsById(params.id)

    return (
        < section className="relative" >
            <div>
                <TwedsCard
                    key={tweds._id}
                    id={tweds._id}
                    currentUserId={user?.id || ""}
                    parentId={tweds.parentId}
                    content={tweds.text}
                    author={tweds.author}
                    community={tweds.community}
                    createdAt={tweds.createdAt}
                    comments={tweds.children}
                />
            </div>


            <div className='mt-7'>
                <Comments
                    twedsId={params.id}
                    currentUserImg={user.imageUrl}
                    currentUserId={JSON.stringify(userInfo._id)}
                />
            </div>

            <div className='mt-10'>
                {tweds.children.map((childItem: any) => (
                    <TwedsCard
                        key={childItem._id}
                        id={childItem._id}
                        currentUserId={childItem?.id || ""}
                        parentId={childItem.parentId}
                        content={childItem.text}
                        author={childItem?.author}
                        community={childItem.community}
                        createdAt={childItem.createdAt}
                        comments={childItem.children}
                        isComment
                    />
                ))}
            </div>

        </ section>
    )
}

export default Page