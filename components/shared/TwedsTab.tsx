import { fetchUserPosts } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import React from 'react'
import TwedsCard from '../cards/TwedsCard';
import { fetchCommunityPosts } from '@/lib/actions/community.actions';


interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const TwedsTab = async ({ currentUserId, accountId, accountType }: Props) => {

  let result: any;
  if (accountType === "Community") {
    result = await fetchCommunityPosts(accountId);
  } else {
    result = await fetchUserPosts(accountId);
  }

  if (!result) redirect('/')


  return (
    <section className='mt-9 flex flex-col gap-10'>
      {result.tweds.map((tweds: any) => (
        <TwedsCard
          key={tweds._id}
          id={tweds._id}
          currentUserId={currentUserId}
          parentId={tweds.parentId}
          content={tweds.text}
          author={
            accountType === "User"
              ? { name: result.name, image: result.image, id: result.id }
              : {
                name: tweds.author.name,
                image: tweds.author.image,
                id: tweds.author.id,
              }
          } community={tweds.community}
          createdAt={tweds.createdAt}
          comments={tweds.children}
        />
      ))}
    </section>
  )
}

export default TwedsTab