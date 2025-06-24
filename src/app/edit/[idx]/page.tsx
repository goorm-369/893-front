"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getPresignedUrl, uploadToS3 } from "@/lib/api/s3Upload";
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
import toast from "react-hot-toast";

import {
  productConditions,
  convertLabelToServerValue,
  convertServerValueToLabel,
} from "@/components/registration/constants/productConditions";
import { getProductData } from "@/lib/api/auction";

type ServerImage = {
  imageId: number;
  url: string;
  originalName: string;
  storeName: string;
};

interface AuctionIdProps {
  params: { idx: number };
}

export default function EditRegistration({ params }: AuctionIdProps) {
  const router = useRouter();
  const auctionId = params.idx;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [serverImages, setServerImages] = useState<ServerImage[]>([]);
  const [category, setCategory] = useState<CategoryValue>({
    id: null,
    mainCategory: "",
    subCategory: "",
    detailCategory: "",
  });
  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<number | null>(null);
  const [detail, setDetail] = useState<string>("");
  const [productStatus, setProductStatus] = useState<number | null>(null);
  const [startTime, setStartTime] = useState({ hour: 0, minute: 0 });
  const [durationTime, setDurationTime] = useState({ hour: 0, minute: 0 });
  const [agreed, setAgreed] = useState<boolean>(false);
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const refs = {
    images: useRef<HTMLDivElement>(null),
    title: useRef<HTMLDivElement>(null),
    category: useRef<HTMLDivElement>(null),
    price: useRef<HTMLDivElement>(null),
    detail: useRef<HTMLDivElement>(null),
    productStatus: useRef<HTMLDivElement>(null),
    startTime: useRef<HTMLDivElement>(null),
    durationTime: useRef<HTMLDivElement>(null),
    agreed: useRef<HTMLDivElement>(null),
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await getProductData(auctionId, '');
        if (!response) return;

        const loaded: ServerImage[] = response.images.map((img) => ({
          imageId: img.imageId,
          url: img.url,
          originalName: img.originalName,
          storeName: img.storeName,
        }));
        setServerImages(loaded);

        setCategory({
          id: response.category.id,
          mainCategory: response.category.mainCategory,
          subCategory: response.category.subCategory,
          detailCategory: response.category.detailCategory,
        });
        setTitle(response.title);
        setPrice(response.basePrice);
        setDetail(response.description);
        const statusLabel = convertServerValueToLabel(response.itemCondition);
        setProductStatus(productConditions.findIndex((l) => l === statusLabel));
      } catch (err) {
        console.error("경매 상세 조회 실패", err);
      }
    })();
  }, [auctionId]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const total = images.length + serverImages.length;

    if (total === 0) newErrors.images = "최소 1장의 이미지를 등록해주세요.";
    if (!title.trim()) newErrors.title = "경매 제목을 입력해주세요.";
    if (!category.id) newErrors.category = "카테고리를 선택해주세요.";
    if (price == null || isNaN(price) || price < 0)
      newErrors.price = "시작 가격을 입력해주세요.";
    if (!detail.trim()) newErrors.detail = "상세 설명을 입력해주세요.";
    if (productStatus === null)
      newErrors.productStatus = "상품 상태를 선택해주세요.";
    if (startTime.hour === 0 && startTime.minute === 0)
      newErrors.startTime = "경매 시작 시간을 설정해주세요.";
    if (durationTime.hour === 0 && durationTime.minute === 0)
      newErrors.durationTime = "경매 시간을 설정해주세요.";
    if (!agreed) newErrors.agreed = "판매자 이용 약관에 동의해주세요.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstKey = Object.keys(newErrors)[0] as keyof typeof refs;
      refs[firstKey]?.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    if (!validateForm()) return;

    try {
      // S3 업로드
      const uploadedStoreNames: { storeName: string; originalName: string }[] =
        [];
      for (const file of images) {
        const { presignedUrl, storeName } = await getPresignedUrl(file);
        await uploadToS3(file, presignedUrl);
        uploadedStoreNames.push({ storeName, originalName: file.name });
      }

      // 기존 + 신규 합치기
      const existing = serverImages.map((img) => ({ imageId: img.imageId }));
      const combined = [...existing, ...uploadedStoreNames];

      // 메인 이미지 기준 재배치
      const reordered = [
        combined[mainImageIndex],
        ...combined.filter((_, i) => i !== mainImageIndex),
      ];

      // 이미지 페이로드 생성
      const imagePayload = reordered.map((img, idx) => {
        if ("imageId" in img) {
          return { imageId: img.imageId, imageSeq: idx };
        }
        return {
          storeName: img.storeName,
          originalName: img.originalName,
          imageSeq: idx,
        };
      });

      const payload = {
        title,
        description: detail,
        itemCondition: convertLabelToServerValue(
          productConditions[productStatus!]
        ),
        basePrice: price,
        startDelay: startTime.hour * 60 + startTime.minute,
        durationTime: durationTime.hour * 60 + durationTime.minute,
        mainImageIndex: 0,
        category,
        images: imagePayload,
      };

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auctions/${auctionId}`,
        payload,
        { withCredentials: true }
      );

      toast.success("경매 수정이 완료되었습니다!");
      router.push(`/detail/${auctionId}?refresh=${Date.now()}`);
      setIsModalOpen(false);
    } catch (err) {
      console.error("PATCH 실패", err);
      toast.error("수정 중 오류가 발생했습니다.");
      setIsSubmitting(false);
    }
  };

  const handleCategoryChange = (value: CategoryValue) => {
    setCategory(value);
    if (value.id && errors.category) {
      const temp = { ...errors };
      delete temp.category;
      setErrors(temp);
    }
  };

  const handleValidationAndOpenModal = () => {
    if (validateForm()) setIsModalOpen(true);
  };

  return (
    <div className="max-w-[1280px] p-8 mx-auto">
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* 이미지 */}
        <div ref={refs.images} className="flex flex-col pb-[55px]">
          <ImageUploader
            value={images}
            onChange={setImages}
            serverImages={serverImages}
            onDeleteServerImage={(i) =>
              setServerImages((prev) => prev.filter((_, idx) => idx !== i))
            }
            onEmptyImage={() =>
              toast.error("최소 1장의 이미지를 등록해주세요.")
            }
            mainImageIndex={mainImageIndex}
            onChangeMainImageIndex={setMainImageIndex}
          />
          {errors.images && (
            <p className="text-warningkeword text-sm">{errors.images}</p>
          )}
        </div>

        {/* 제목 */}
        <div ref={refs.title} className="flex flex-col pb-[39px]">
          <AuctionTitleInput value={title} onChange={setTitle} />
          {errors.title && (
            <p className="text-warningkeword text-sm">{errors.title}</p>
          )}
        </div>

        {/* 카테고리 */}
        <div ref={refs.category} className="flex flex-col pb-[20px]">
          <CategorySelector value={category} onChange={handleCategoryChange} />
          {errors.category && (
            <p className="text-warningkeword text-sm">{errors.category}</p>
          )}
        </div>

        {/* 가격 */}
        <div ref={refs.price} className="flex flex-col pb-[20px]">
          <PaymentInput value={price} onChange={setPrice} />
          {errors.price && (
            <p className="text-warningkeword text-sm">{errors.price}</p>
          )}
        </div>

        {/* 상세 설명 */}
        <div ref={refs.detail} className="flex flex-col pb-[38px]">
          <DetailedInput value={detail} onChange={setDetail} />
          {errors.detail && (
            <p className="text-warningkeword text-sm">{errors.detail}</p>
          )}
        </div>

        {/* 상품 상태 */}
        <div ref={refs.productStatus} className="flex flex-col pb-[75px]">
          <ProductStatus value={productStatus} onChange={setProductStatus} />
          {errors.productStatus && (
            <p className="text-warningkeword text-sm">{errors.productStatus}</p>
          )}
        </div>

        {/* 시작/기간 */}
        <div className="flex justify-center flex-nowrap pb-[240px] gap-10">
          <div ref={refs.startTime} className="flex flex-col items-center">
            <AuctionStartTimeButton value={startTime} onChange={setStartTime} />
            {errors.startTime && (
              <p className="text-warningkeword text-sm mt-1">
                {errors.startTime}
              </p>
            )}
          </div>
          <div ref={refs.durationTime} className="flex flex-col items-center">
            <AuctionTimeButton
              value={durationTime}
              onChange={setDurationTime}
            />
            {errors.durationTime && (
              <p className="text-warningkeword text-sm mt-1">
                {errors.durationTime}
              </p>
            )}
          </div>
        </div>

        {/* 동의 */}
        <div ref={refs.agreed} className="flex justify-center pb-[20px]">
          <SellerAgreementCheckbox onChange={setAgreed} />
        </div>
        {errors.agreed && (
          <p className="text-warningkeword text-sm text-center">
            {errors.agreed}
          </p>
        )}

        {/* 수정하기 */}
        <div className="flex justify-center">
          <SellButton
            label="수정하기"
            isModalOpen={isModalOpen}
            onClick={handleValidationAndOpenModal}
            onModalClose={() => setIsModalOpen(false)}
            onConfirm={handleSubmit}
            confirmDisabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
}
