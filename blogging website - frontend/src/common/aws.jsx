import axios from "axios";

export const uploadImage = async (img) => {
  let imgURL = null;
  await axios
    .get(import.meta.env.VITE_SERVER_DOMAIN + "/get-upload-url")
    .then(async ({ data: { uploadURL } }) => {
      await axios({
        method: "put",
        url: uploadURL,
        headers: { "Content-Type": "multipart/form-data" },
        data: img,
      }).then(() => {
        imgURL = uploadURL.split("?")[0];
      });
    });
  return imgURL;
};
