import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const Page = async () => {
    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect("/onboarding");

    const activity = await getActivity(userInfo._id);

    return (
        <>
            <h1 className='head-text mb-10'>Activity</h1>

            <section className='mt-10 flex flex-col gap-5 '>
                {activity.length > 0 ? (
                    <>
                        {activity.map((activity: any) => (
                            <Link key={activity._id} href={`/tweds/${activity._id}`}>
                                <article className='activity-card py-6'>
                                    <Image
                                        src={activity.author.image}
                                        alt='user_logo'
                                        width={48}
                                        height={48}
                                        className='rounded-full object-cover'
                                    />
                                    <p className='!text-small-regular text-light-1'>
                                        <span className='mr-1 text-primary-500'>
                                            {activity.author.name}
                                        </span>{" "}
                                        replied to your tweds
                                    </p>
                                </article>
                            </Link>
                        ))}
                    </>
                ) : (
                    <p className='!text-base-regular text-light-3'>No activity yet</p>
                )}
            </section>
        </>
    )
}

export default Page;
