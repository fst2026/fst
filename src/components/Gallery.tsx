"use client";

import Image from "next/image";
import { useState } from "react";
import { Carousel, Modal } from "react-bootstrap";

type Props = {
  images: string[];
  externalGalleryUrl?: string;
};

export function Gallery({ images, externalGalleryUrl }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  function openGallery(index: number) {
    setActiveIndex(index);
    setShowModal(true);
  }

  function closeGallery() {
    setShowModal(false);
  }

  return (
    <>
      <div className="gallery">
        {images.map((src, index) => (
          <button
            key={src}
            type="button"
            className="gallery-item"
            onClick={() => openGallery(index)}
            aria-label={`Otwórz zdjęcie ${index + 1}`}
          >
            <Image
              src={src}
              alt={`Galeria Fanatic Summer Car Show - zdjęcie ${index + 1}`}
              width={1200}
              height={800}
              sizes="(max-width: 860px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
              className="gallery-image"
            />
          </button>
        ))}
      </div>

      {externalGalleryUrl && (
        <p className="gallery-link">
          <a
            href={externalGalleryUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            Zobacz pełną galerię
          </a>
        </p>
      )}

      <Modal
        show={showModal}
        onHide={closeGallery}
        centered
        size="xl"
        className="gallery-modal"
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title className="gallery-modal-title">
            Galeria ({activeIndex + 1} / {images.length})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Carousel
            activeIndex={activeIndex}
            onSelect={(selectedIndex) => setActiveIndex(selectedIndex)}
            interval={null}
            indicators={images.length > 1}
          >
            {images.map((src, index) => (
              <Carousel.Item key={`modal-${src}-${index}`}>
                <Image
                  src={src}
                  alt={`Zdjęcie ${index + 1}`}
                  width={1600}
                  height={1000}
                  className="gallery-modal-image"
                  priority={index === activeIndex}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </Modal.Body>
      </Modal>
    </>
  );
}
