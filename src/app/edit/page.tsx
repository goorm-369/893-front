"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ImageUploader from "@/components/registration/ImageUploader";
import AuctionTitleInput from "@/components/registration/AuctionTitleInput";
import PaymentInput from "@/components/registration/PaymentInput";
import DetailedInput from "@/components/registration/DetailedInput";
import ProductStatus from "@/components/registration/ProductStatus";
import CategorySelector, {
  CategoryValue,
} from "@/components/registration/CategorySelect";
import SellerAgreementCheckbox from "@/components/registration/SellerAgreementCheckbox";
import SellButton from "@/components/registration/SellButton";
import AuctionStartTimeButton from "@/components/registration/AuctionStartTimeButton";
import AuctionTimeButton from "@/components/registration/AuctionTimeButton";
import {
  productConditions,
  convertLabelToServerValue,
  convertServerValueToLabel,
} from "@/components/registration/constants/productConditions";

type ServerImage = {
  url: string;
  originalName: string;
  storeName: string;
};

export default function EditRegistration() {
  const [images, setImages] = useState<File[]>([]);
  const [serverImages, setServerImages] = useState<ServerImage[]>([]);
  const [category, setCategory] = useState<CategoryValue>({
    id: null,
    mainCategory: "",
    subCategory: "",
    detailCategory: "",
  });
  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [detail, setDetail] = useState<string>("");
  const [agreed, setAgreed] = useState<boolean>(false);
  const [productStatus, setProductStatus] = useState<number | null>(null);
  const [startTime, setStartTime] = useState({ hour: 0, minute: 0 });
  const [durationTime, setDurationTime] = useState({ hour: 0, minute: 0 });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const auctionId = 13; // 실제로는 props나 router에서 받아야 함 <-- 라우팅 설정 필요

  const validateForm = () => {
    const totalImageCount = images.length + serverImages.length;
    if (totalImageCount === 0)
      return alert("이미지를 최소 1장 업로드해주세요."), false;
    if (!title.trim()) return alert("제목을 입력해주세요."), false;
    if (!detail.trim()) return alert("상세 설명을 입력해주세요."), false;
    if (
      !category.id ||
      !category.mainCategory ||
      !category.subCategory ||
      !category.detailCategory
    )
      return alert("카테고리를 모두 선택해주세요."), false;
    if (price < 0) return alert("가격은 0 이상이어야 합니다."), false;
    if (durationTime.hour === 0 && durationTime.minute < 10)
      return alert("경매 기간은 최소 10분 이상이어야 합니다."), false;
    if (productStatus === null)
      return alert("상품 상태를 선택해주세요."), false;
    if (!agreed) return alert("판매자 이용 약관에 동의해주세요."), false;
    return true;
  };

  const [mainImageIndex, setMainImageIndex] = useState<number>(0); // 대표 이미지 인덱스 추가

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const label = productConditions[productStatus!];
    const itemCondition = convertLabelToServerValue(label);

    const allImagesRaw = [...serverImages, ...images];
    const reorderedImages = [
      allImagesRaw[mainImageIndex],
      ...allImagesRaw.filter((_, idx) => idx !== mainImageIndex),
    ];
    const allImages = reorderedImages.map((img, idx) => ({
      imageId:
        "imageId" in img && typeof img.imageId === "number"
          ? img.imageId
          : null,
      imageSeq: idx,
    }));

    const requestPayload = {
      title,
      description: detail,
      itemCondition,
      basePrice: price,
      startDelay: startTime.hour * 60 + startTime.minute,
      durationTime: durationTime.hour * 60 + durationTime.minute,
      mainImageIndex: 0, // 항상 대표 이미지가 첫 번째
      category: {
        id: category.id,
        mainCategory: category.mainCategory,
        subCategory: category.subCategory,
        detailCategory: category.detailCategory,
      },
      images: allImages,
    };
    console.log("🧩 이미지 시퀀스 확인:");
    console.log(
      reorderedImages.map((img, idx) => ({
        imageId: "imageId" in img ? img.imageId : "(신규)",
        imageSeq: idx,
      }))
    );

    console.log("📦 전체 requestPayload:");
    console.log(JSON.stringify(requestPayload, null, 2));
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });
    formData.append(
      "request",
      new Blob([JSON.stringify(requestPayload)], { type: "application/json" })
    );

    try {
      await axios.patch(
        `http://localhost:8080/api/auctions/${auctionId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("경매 수정이 완료되었습니다!");
      setIsModalOpen(false);
    } catch (err) {
      console.error("❌ PATCH 실패", err);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    const fetchAuctionData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/auctions/${auctionId}/update`
        );
        const data = res.data.data; // ✅ 여기 수정 중요

        // 🔒 null-safe 처리
        const correctedImages = (data.images ?? []).map((img: ServerImage) => ({
          ...img,
          url: img.url.startsWith("http")
            ? img.url
            : `http://localhost:8080${img.url}`,
        }));

        setTitle(data.title);
        setPrice(data.basePrice);
        setDetail(data.description);
        setServerImages(correctedImages); // ✅ 보정된 이미지 사용
        setCategory({
          id: data.category.id,
          mainCategory: data.category.mainCategory,
          subCategory: data.category.subCategory,
          detailCategory: data.category.detailCategory,
        });

        const statusLabel = convertServerValueToLabel(data.itemCondition);
        const statusIndex = productConditions.findIndex(
          (label) => label === statusLabel
        );
        setProductStatus(statusIndex);
      } catch (err) {
        console.error("기존 경매 데이터 로딩 실패", err);
      }
    };

    fetchAuctionData();
  }, []);

  return (
    <div className="max-w-[1280px] p-8 mx-auto">
      <form className="flex flex-col gap-4">
        <div className="flex flex-col pb-[79px]">
          <ImageUploader
            value={images}
            onChange={setImages}
            serverImages={serverImages}
            onDeleteServerImage={(index) => {
              setServerImages((prev) => {
                const updated = prev.filter((_, i) => i !== index);

                return [...updated]; // ✅ 새로운 참조 배열로 상태 변경
              });
            }}
            onEmptyImage={() => alert("최소 1장의 이미지를 등록해주세요.")}
            mainImageIndex={mainImageIndex}
            onChangeMainImageIndex={setMainImageIndex}
          />
        </div>

        <div className="flex flex-col pb-[39px]">
          <AuctionTitleInput value={title} onChange={setTitle} />
        </div>

        <div className="flex flex-col pb-[20px]">
          <CategorySelector value={category} onChange={setCategory} />
        </div>

        <div className="flex flex-col pb-[20px]">
          <PaymentInput value={price} onChange={setPrice} />
        </div>

        <div className="flex flex-col pb-[38px]">
          <DetailedInput value={detail} onChange={setDetail} />
        </div>

        <div className="flex flex-col pb-[75px]">
          <ProductStatus value={productStatus} onChange={setProductStatus} />
        </div>

        <div className="flex justify-center flex-nowrap pb-[240px] gap-10">
          <AuctionStartTimeButton value={startTime} onChange={setStartTime} />
          <AuctionTimeButton value={durationTime} onChange={setDurationTime} />
        </div>

        <div className="flex justify-center pb-[20px]">
          <SellerAgreementCheckbox onChange={setAgreed} />
        </div>

        <div className="flex justify-center">
          <SellButton
            label="수정하기"
            isModalOpen={isModalOpen}
            onClick={() => setIsModalOpen(true)}
            onModalClose={() => setIsModalOpen(false)}
            onConfirm={handleSubmit}
          />
        </div>
      </form>
    </div>
  );
}
