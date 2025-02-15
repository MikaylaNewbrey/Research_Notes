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
    loadGallery();
  }
});

/*******************************************
 * 2. Lightbox for Images & Videos
 *******************************************/
let currentIndex = 0;
const galleryItems = [
  { type: "image", id: "1o-cMnKZoqqr25Wjj6HUqjnX-9F-SCxFW", name: "Remus_Wellfleet" },
  { type: "image", id: "YOUR_SECOND_IMAGE_ID", name: "Another Image" },
  { type: "video", id: "YOUR_VIDEO_FILE_ID", name: "Research Video" }
];

function loadGallery() {
  let imageGallery = document.getElementById("image-gallery");
  let videoGallery = document.getElementById("video-gallery");

  galleryItems.forEach((item, index) => {
    let element;
    let url = item.type === "image" 
      ? `https://drive.google.com/uc?export=view&id=${item.id}`
      : `https://drive.google.com/file/d/${item.id}/preview`;

    if (item.type === "image") {
      element = document.createElement("img");
      element.src = url;
      element.alt = item.name;
      element.classList.add("gallery-item");
      element.onclick = () => openLightbox(index);
      imageGallery.appendChild(element);
    } else {
      element = document.createElement("iframe");
      element.src = url;
      element.width = "640";
      element.height = "360";
      element.classList.add("gallery-item");
      videoGallery.appendChild(element);
    }
  });
}

// Open lightbox
function openLightbox(index) {
  currentIndex = index;
  let lightbox = document.getElementById("lightbox");
  let lightboxImg = document.getElementById("lightbox-img");
  let lightboxVideo = document.getElementById("lightbox-video");

  let item = galleryItems[index];
  let url = item.type === "image" 
    ? `https://drive.google.com/uc?export=view&id=${item.id}`
    : `https://drive.google.com/file/d/${item.id}/preview`;

  if (item.type === "image") {
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

document.addEventListener("DOMContentLoaded", loadGallery);
