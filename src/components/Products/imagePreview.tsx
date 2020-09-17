import React, { FC } from "react";
import { Image } from "../../reducks/products/types";

type ImagePreViewProps = {
  delete: (id: string) => Promise<Image>;
  key: number;
  image: Image;
};

const ImagePreview: FC<ImagePreViewProps> = (props) => {
  const { path, id } = props.image;
  return (
    <div className="p-media__thumb">
      <img alt="image" src={path} onClick={() => props.delete(id)} />
    </div>
  );
};

export default ImagePreview;
