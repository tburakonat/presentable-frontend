import { VideoList } from "@/components";
import { Video } from "@/types";
import { GetStaticPropsResult } from "next"
import Head from "next/head";

import fs from 'fs';
import path from 'path';
  
interface IVideosProps {
    videos: Video[];
}

export default function VideosPage({ videos }: IVideosProps) {
  return (
    <>
      <Head>
        <title>Alle Videos</title>
      </Head>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-start">Video List</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <VideoList videos={videos} />
        </div>
      </div>
    </>
  );
}


export async function getStaticProps(): Promise<GetStaticPropsResult<IVideosProps>> {
  const dataDirectory = path.join(process.cwd(), 'data');
  const filePath = path.join(dataDirectory, 'videos.json');
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  const videos = JSON.parse(fileContents);
  
    return {
      props: {
        videos,
      },
    };
};
  