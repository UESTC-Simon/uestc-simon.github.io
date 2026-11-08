import { notFound } from 'next/navigation';
import { ArticlePage } from '@/components/writing';
import { getPost, posts } from '@/lib/posts';

export function generateStaticParams(){return posts.map(post=>({slug:post.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;const post=getPost(slug);
  return post?{title:post.title,description:post.summary,robots:post.draft?{index:false,follow:false}:undefined,openGraph:{title:post.title,description:post.summary,type:'article',publishedTime:post.date}}:{title:'Article not found'};
}
export default async function Page({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;const post=getPost(slug);if(!post)notFound();return <ArticlePage post={post}/>;
}
