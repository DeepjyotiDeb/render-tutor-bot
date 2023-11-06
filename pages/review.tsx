import Image from 'next/image';
import Link from 'next/link';

// import Review from './../public/images/Review.png';

export default function ReviewPage() {
  return (
    <div className="">
      <div className="relative w-fit m-auto">
        {/* <Image src={Review} alt="dashboard" className="max-h-screen w-fit" /> */}
        <Link
          href="/chatbot/?promptId=item_focus_problem"
          className="absolute bottom-[3%] right-0 h-[11%] w-[11%] rounded-full hover:bg-slate-50 hover:opacity-30"
        ></Link>
        <Link
          href="/"
          className="absolute top-[16%] left-0 h-[6%] w-[28%] hover:bg-slate-50 hover:opacity-30"
        ></Link>
      </div>
      {/* <div className="max-w-[60rem] h-[100vh] m-auto "></div> */}
    </div>
  );
}
