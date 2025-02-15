/*******************************************
 * 1. Load Notebook & Posts from GitHub
 *******************************************/
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("entries")) {
    loadMarkdownFiles("Notebook", "entries");
  }
  if (document.getElementById("posts-container")) {
    loadMarkdownFiles("Posts", "posts-container");
  }
  if (document.getElementById("image-gallery")) {
    setupGalleryLightbox();
  }
});

/*******************************************
 * 2. Lightbox for Images & Videos (Dynamic)
 *******************************************/
let galleryItems = [];
let currentIndex = 0;

function setupGalleryLightbox() {
  let images = document.querySelectorAll(".gallery-item");
  galleryItems = Array.from(images);

  images.forEach((item, index) => {
    item.addEventListener("click", function () {
      openLightbox(index);
    });
  });
}

// Open lightbox
function openLightbox(index) {
  currentIndex = index;
  let lightbox = document.getElementById("lightbox");
  let lightboxImg = document.getElementById("lightbox-img");
  let lightboxVideo = document.getElementById("lightbox-video");

  let item = galleryItems[currentIndex];
  let isVideo = item.tagName === "IFRAME";
  let url = item.src;

  if (!isVideo) {
    lightboxImg.src = url;
    lightboxImg.style.display = "block";
    lightboxVideo.style.display = "none";
  } else {
    lightboxVideo.src = url;
    lightboxVideo.style.display = "block";
    lightboxImg.style.display = "none";
  }

  lightbox.style.display = "flex";
}

// Next/Prev navigation
function changeMedia(direction) {
  currentIndex += direction;
  if (currentIndex < 0) currentIndex = galleryItems.length - 1;
  if (currentIndex >= galleryItems.length) currentIndex = 0;

  openLightbox(currentIndex);
}

// Close lightbox
function closeLightbox() {
  let lightbox = document.getElementById("lightbox");
  let lightboxImg = document.getElementById("lightbox-img");
  let lightboxVideo = document.getElementById("lightbox-video");

  lightbox.style.display = "none";
  lightboxImg.src = "";
  lightboxVideo.src = "";
}
