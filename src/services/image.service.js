const fs = require("fs");
const path = require("path");
const imageRepository = require("../repositories/image.repository");

const saveUploadedImages = async (files, productId, productVariantId) => {
  const images = files.map((file) => {
    return {
      url: `/uploads/${file.file.fieldname}`,
      alt: file.file.originalname,
      productId: file.productId,
      productVariantId: file.productVariantId,
    };
  });

  return await imageRepository.createManyImages(images);
};

// const updateImagesByProductId = async (imagesWithVariants) => {
//   for (const item of imagesWithVariants) {
//     const { file, productId, productVariantId } = item;

//     // Kiểm tra ảnh đã tồn tại chưa dựa vào originalname (alt)
//     const isExist = await imageRepository.exists({
//       alt: file.originalname,
//       productId,
//       productVariantId,
//       isDeleted: false,
//     });

//     if (isExist) {
//       // Xoá file upload thừa
//       const filepath = path.join(__dirname, "../../uploads", file.filename);
//       if (fs.existsSync(filepath)) {
//         fs.unlinkSync(filepath);
//       }
//       continue;
//     }

//     // Nếu là ảnh mới, lưu vào DB
//     await imageRepository.createImage({
//       url: `/uploads/${file.filename}`,
//       alt: file.originalname,
//       productId,
//       productVariantId,
//     });

//     // Xoá các ảnh cũ (khác với originalname này)
//     const oldImages = await imageRepository.find({
//       productId,
//       productVariantId,
//       alt: { $ne: file.originalname },
//       isDeleted: false,
//     });

//     for (const img of oldImages) {
//       const oldPath = path.join(__dirname, "../../", img.url);
//       if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
//       await imageRepository.softDelete(img._id);
//     }
//   }
// };

const updateImagesByProductId = async (imagesWithVariants) => {
  for (const item of imagesWithVariants) {
    const { file, productId, productVariantId } = item;

    // Kiểm tra ảnh đã tồn tại dựa vào alt
    const isExist = await imageRepository.exists({
      alt: file.originalname,
      productId,
      productVariantId,
      isDeleted: false,
    });

    const uniqueName = `${Date.now()}-${file.originalname}`;
    const uploadPath = path.join(__dirname, "../../uploads", uniqueName);

    if (!isExist) {
      // Ghi ảnh mới
      fs.writeFileSync(uploadPath, file.buffer);

      // Thêm DB
      await imageRepository.createImage({
        url: `/uploads/${uniqueName}`,
        alt: file.originalname,
        productId,
        productVariantId,
      });
    } else {
      // Nếu đã tồn tại, không lưu file thừa
      if (fs.existsSync(uploadPath)) fs.unlinkSync(uploadPath);
    }

    // Xoá ảnh cũ khác alt
    // const oldImages = await imageRepository.find({
    //   productId,
    //   productVariantId,
    //   alt: { $ne: file.originalname },
    //   isDeleted: false,
    // });

    // for (const img of oldImages) {
    //   const oldPath = path.join(__dirname, "../../", img.url);
    //   if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    //   await imageRepository.softDelete(img._id);
    // }
  }
};

const imageService = {
  saveUploadedImages,
  updateImagesByProductId,
};

module.exports = imageService;
