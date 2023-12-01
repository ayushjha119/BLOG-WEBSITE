import { useEffect, useState } from "react";
import Loader from "../components/loader.component";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import axios from "axios";
const HomePage = () => {
  let [blogs, setBlog] = useState(null);

  const fetchLatestBlogs = () => {
    // fetch latest blogs
    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs")
      .then(({ data }) => {
        setBlog(data.blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchLatestBlogs();
  }, []);

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* latest blog */}
        <div className="w-full">
          <InPageNavigation
            routes={["home", "trending blogs"]}
            defaultHidden={["trending blogs"]}
          >
            <>
              {blogs == null ? (
                <Loader />
              ) : (
                blogs.map((blog, i) => {
                  return <h1 key={i}>{blog.title}</h1>;
                })
              )}
            </>
            <h1>Trending Blogs Here</h1>
          </InPageNavigation>
        </div>
        {/* filter treanding blog */}
        <div></div>
      </section>
    </AnimationWrapper>
  );
};

export default HomePage;
