import React from "react";

const PageComments = ({pageNum, PageComments}) => {
  const exampleData = [
    {
      name: "name",
      avatarURL:
        "https://yt3.ggpht.com/ytc/AKedOLQFCSVrqjFIW4_wDf-XAB60ze8RHm-zE-c3oVe0=s88-c-k-c0x00ffffff-no-rj-mo",
      comment: "yes this is an absolutely amazing book",
    },
    {
      name: "name",
      avatarURL:
        "https://yt3.ggpht.com/ytc/AKedOLQFCSVrqjFIW4_wDf-XAB60ze8RHm-zE-c3oVe0=s88-c-k-c0x00ffffff-no-rj-mo",
      comment: "yes this is an absolutely amazing book",
    },
    {
      name: "name",
      avatarURL:
        "https://yt3.ggpht.com/ytc/AKedOLQFCSVrqjFIW4_wDf-XAB60ze8RHm-zE-c3oVe0=s88-c-k-c0x00ffffff-no-rj-mo",
      comment: "yes this is an absolutely amazing book",
    },
  ];
  return (
    <section className="page-comments">
      <h3>Comments</h3>
      <form>
        <img
          src="https://yt3.ggpht.com/ytc/AKedOLQFCSVrqjFIW4_wDf-XAB60ze8RHm-zE-c3oVe0=s88-c-k-c0x00ffffff-no-rj-mo"
          alt=""
          width={30}
          height={30}
        />
        <input type="text" placeholder="Comment on this Page" />
      </form>
      {exampleData.map((data) => (
        <div className="comment">
          <img src={data.avatarURL} alt="" width={30} height={30}/>
          <span>{data.name}</span>
          <p>{data.comment}</p>
        </div>
      ))}
    </section>
  );
};

export default PageComments;
