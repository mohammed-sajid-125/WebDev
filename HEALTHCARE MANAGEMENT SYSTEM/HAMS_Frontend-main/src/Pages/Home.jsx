import Header from "../components/header";
import TopDoc from "../components/topDoc";
import Programs from "../components/programs";
import Feedback from "../components/feedback";
import Shopping from "../components/ShoppingCart";
import Footer from "../components/footer";
import FloatingBar from "../components/FloatingBar";

const Home = () => {
  return (
    <>
      <Header />
      <main className="flex flex-col gap-8 md:gap-12 lg:gap-16 bg-[#f9fafb] relative px-2 sm:px-4 md:px-8 lg:px-16 xl:px-32 pt-4 md:pt-8">
        <section className="pt-2 md:pt-6">
          <TopDoc />
        </section>
        <section className="mt-4 md:mt-8">
          <Shopping />
        </section>
        <section className="mt-4 md:mt-8">
          <Programs />
        </section>
        <section className="mt-4 md:mt-8">
          <Feedback />
        </section>
      </main>
      <Footer />
      {/* Floating Sidebar */}
      <FloatingBar />
    </>
  );
};

export default Home;
