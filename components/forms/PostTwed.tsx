"use client"


import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Textarea } from "@/components/ui/textarea";
import { TwedValidation } from "@/lib/validations/tweds";
import { createTweds } from "@/lib/actions/twed.actions";
// import { updateUser } from "@/lib/actions/user.actions";



interface Props {
    user: {
        id: string,
        objectId: string,
        username: string,
        name: string,
        bio: string,
        image: string,
    };
    btnTitle: string
}



function PostTwed({ userId }: { userId: string }) {
    const router = useRouter();
    const pathname = usePathname();

    const form = useForm({
        resolver: zodResolver(TwedValidation),
        defaultValues: {
            twed: '',
            accountId: userId
        }
    });


    const onSubmit = async (values: z.infer<typeof TwedValidation>) => {
        await createTweds({
            text: values.twed,
            author: userId,
            communityId: null,
            path: pathname
        })

        router.push("/")
    }
    return (
        <>
            <Form {...form}>
                <form
                    className="mt-10 space-y-8 flex-col justify-start gap-10"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FormField
                        control={form.control}
                        name='twed'
                        render={({ field }) => (
                            <FormItem className='flex w-full flex-col gap-3'>
                                <FormLabel className='text-base-semibold text-light-2'>
                                    Content
                                </FormLabel>
                                <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                                    <Textarea
                                        rows={15}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <Button type="submit" className="bg-primary-500">
                        Post Twed
                    </Button>

                </form>
            </Form>
        </>
    )
}


export default PostTwed;