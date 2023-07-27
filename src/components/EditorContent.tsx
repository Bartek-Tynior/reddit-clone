'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { FC } from 'react'

const Output = dynamic(
    async () => (await import('editorjs-react-renderer')).default,
    { ssr: false }
    )

interface EditorContentProps {
    content: any
}

const style = {
    paragraph: {
        fontSize: '0.875rem',
        lineHeight: '1.25rem',
    }
}

const renderers = {
    image: CustomImageRenderer,
    code: CustomCodeRenderer,
}

const EditorContent: FC<EditorContentProps> = ({ content }) => {

    return <Output style={style} data={content} className='text-sm' renderers={renderers} />

}

function CustomCodeRenderer({ data }: any) {
    return (
        <pre className='bg-gray-800 rounded-md p-4'>
            <code className='text-gray-100 text-sm'>{data.code}</code>
        </pre>
    )
}

function CustomImageRenderer({ data }: any) {
    const src = data.file.url

    return (
        <div className='relative w-full min-h-[15rem]'>
            <Image src={src} fill alt='Post Image' className='object-contain' />
        </div>
    )
}

export default EditorContent