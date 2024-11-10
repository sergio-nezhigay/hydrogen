import React from 'react';

interface DynamicGalleryProps<T> {
  data: T[];
  presentationComponent: React.ComponentType<{item: T; index: number}>;
  itemStyle: string;
}

function DynamicGallery<T>({
  data,
  presentationComponent: PresentationComponent,
  itemStyle,
}: DynamicGalleryProps<T>) {
  return (
    <div className="dynamic-gallery-container">
      {data.map((item, index) => (
        <div className={`dynamic-gallery-item ${itemStyle}`} key={index}>
          <PresentationComponent item={item} index={index} />
        </div>
      ))}
    </div>
  );
}

export default DynamicGallery;
