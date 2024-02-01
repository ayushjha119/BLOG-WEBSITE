import { Link, useNavigate, useParams } from "react-router-dom";
import LightLogo from "../imgs/logo-light.png";
import DarkLogo from "../imgs/logo-dark.png";
import AnimationWrapper from "../common/page-animation";
import lightBanner from "../imgs/blog banner light.png";
import darkBanner from "../imgs/blog banner dark.png";
import { uploadImage } from "../common/aws";
import { useContext, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import Editor, { EditorContext } from "../pages/editor.pages";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component";
import { ThemeContext, UserContext } from "../App";
import axios from "axios";

const BlogEditor = () => {
  //let blogBannerRef = useRef();



  let {
    blog,
    blog: { title, banner, content, tags, des },
    setBlog,
    textEditor,
    setTextEditor,
    setEditorState,
  } = useContext(EditorContext);

  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  let {theme} = useContext(ThemeContext)

  let { blog_id } = useParams();

  let navigate = useNavigate();

  //useEffect hook

  useEffect(() => {
    if (!textEditor.isReady) {
      setTextEditor(
        new EditorJS({
          holder: "textEditor",
          data: Array.isArray(content) ? content[0] : content,
          tools: tools,
          placeholder: "Start writing your blog...",
        })
      );
    }
  }, []);

  const handleBannerUpload = (e) => {
    let img = e.target.files[0];
    if (img) {
      let loadingToast = toast.loading("Uploading banner...");
      uploadImage(img)
        .then((url) => {
          if (url) {
            toast.dismiss(loadingToast);
            toast.success("Banner uploaded 👍");

            setBlog({ ...blog, banner: url });
          }
        })
        .catch((err) => {
          toast.dismiss(loadingToast);
          return toast.error(err);
        });
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  const handleTitleChange = (e) => {
    let input = e.target;
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
    setBlog({ ...blog, title: input.value });
  };

  const handleError = (e) => {
    let img = e.target;
    if (theme == "light") {
      img.src = lightBanner;
    } else {
      img.src = darkBanner;
    }
  };

  const handlePublishEvent = () => {
    if (!banner.length) {
      return toast.error("Please upload banner to publish it");
    }
    if (!title.length) {
      return toast.error("Please enter title of blog to publish");
    }
    if (textEditor.isReady) {
      textEditor
        .save()
        .then((data) => {
          if (data.blocks.length) {
            setBlog({ ...blog, content: data });
            setEditorState("publish");
          } else {
            return toast.error("Please write some content to publish");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleSaveDraft = (e) => {
    if (e.target.className.includes("disable")) {
      return;
    }

    if (!title.length) {
      return toast.error("Please add a title before saving draft");
    }

    let loadingToast = toast.loading("Saving your draft...");
    e.target.classList.add("disable");

    if (textEditor.isReady) {
      textEditor.save().then((content) => {
        let blogObj = {
          title,
          banner,
          des,
          content,
          tags,
          draft: true,
        };
        axios
          .post(
            import.meta.env.VITE_SERVER_DOMAIN + "/create-blog",
            { ...blogObj, id: blog_id },
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          )
          .then(() => {
            e.target.classList.remove("disable");
            toast.dismiss(loadingToast);
            toast.success("Blog Saved successfully 👍");

            setTimeout(() => {
              navigate("/dashboard/blogs?tab=draft");
            }, 500);
          })
          .catch(({ response }) => {
            e.target.classList.remove("disable");
            toast.dismiss(loadingToast);
            return toast.error(response.data.error);
          });
      });
    }
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-10 ">
          <img src={theme == "light" ? DarkLogo : LightLogo} />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {title.length ? title : "New blog"}
        </p>
        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2" onClick={handlePublishEvent}>
            publish
          </button>
          <button className="btn-light py-2" onClick={handleSaveDraft}>
            Save draft
          </button>
        </div>
      </nav>
      <Toaster />
      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
              <label htmlFor="uploadBanner">
                <img src={banner} className="z-20" onError={handleError} />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>

            <textarea
              defaultValue={title}
              placeholder="Blog Title"
              className="text-4xl font-medium w-full h-20 
              outline-none resize-none mt-10 leading-tight placeholder:opacity-40 bg-white"
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChange}
            ></textarea>

            <hr className="w-full opacity-10 my-5" />

            <div id="textEditor" className="font-gelasio"></div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
