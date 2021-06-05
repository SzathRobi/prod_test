import React, { useEffect } from "react";
import { GetStaticProps, GetServerSideProps } from "next";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import prisma from '../lib/prisma'
import Link from "next/link"
import { useRouter } from 'next/router'
import { getSession, useSession } from "next-auth/client";

export const getServerSideProps: GetServerSideProps = async ({req}) => {

  const session = await getSession({ req });
  const userName = session?.user.name

  const feed = await prisma.post.findMany({
    where: {
      author: {
        name: session ? userName : null
      }
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });
  return {
    props: { session, feed },
  };
};

type Props = {
  feed: PostProps[];
};

const Blog = ({feed, session}) => {

  
  const router = useRouter()
  const justPush = () => {
    router.replace("/api/auth/signin")
  }

  console.log(feed)
  useEffect(() => {
    if(!session) {
      justPush()
    }
  },[])

  return (
    <main>
      {
      session
      ? 
      <section>
        <h1>fasza {session.user.email}</h1>
        <Link href="/create"><a>NEW POST</a></Link>
        {feed.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))
        }
      </section>
      : null
      }
    </main>
  )

  /*
  }
  if(session) {
    return (
     
        <div>
          <h1>Logged in Madafaka</h1>
          Email: {session.user.email} 
          <br />
          Name: {session.user.name}

          <div>
            <Link href="/create"><a>New Post</a></Link>
          </div>
          <main>
            {props.feed.map((post) => (
              <div key={post.id} className="post">
                <Post post={post} />
              </div>
            ))}
          </main>
        </div>
      
    )
  }*/
  
{/** 
  return (
    <Layout>
      <div className="page">
        <h1>Public Feed</h1>
        <main>
          {props.feed.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  );*/}
};

export default Blog;
