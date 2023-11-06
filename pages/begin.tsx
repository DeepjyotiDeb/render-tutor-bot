// export { default, getServerSideProps } from './api/home';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

// import StudentDashboard from './../public/images/StudentDashboard.png';

export default function FirstPage() {
  return (
    <div className="">
      <Head>
        <title>Assignments</title>
      </Head>
      <div className="relative w-fit m-auto h-auto">
        <Image
          src={`${process.env.NEXT_PUBLIC_AWS_IMAGE}/assignmentPage.png`}
          alt="dashboard"
          className="max-h-screen w-fit"
          unoptimized
          // fill={true}
          height={100}
          width={100}
        />
        <Link
          // href="/chatbot/?promptId=item_focus_problem"
          href="/begin"
          className="absolute top-[45%] right-[28.5%] translate-x-1/3 h-[11%] w-2/3 hover:bg-slate-50 hover:opacity-30"
        ></Link>
      </div>
      {/* <div className="max-w-[60rem] h-[100vh] m-auto "></div> */}
    </div>
  );
}
