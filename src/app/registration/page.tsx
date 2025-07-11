"use client";

import { useRef, useState } from "react";
import axios, { AxiosError } from "axios";
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
  convertLabelToServerValue,
  productConditions,
} from "@/components/registration/constants/productConditions";

export default function Registration() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<number | null>(null);
  const [detail, setDetail] = useState<string>("");
  const [agreed, setAgreed] = useState<boolean>(false);
  const [productStatus, setProductStatus] = useState<number | null>(null);
  const [startTime, setStartTime] = useState({ hour: 0, minute: 0 });
  const [durationTime, setDurationTime] = useState({ hour: 0, minute: 0 });
  const [category, setCategory] = useState<CategoryValue>({
    id: null,
    mainCategory: "",
    subCategory: "",
    detailCategory: "",
  });
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
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (images.length === 0)
      newErrors.images = "최소 1장의 이미지를 등록해주세요.";
    if (!title.trim()) newErrors.title = "경매 제목을 입력해주세요.";
    if (!category.id) newErrors.category = "카테고리를 선택해주세요.";
    if (price == null || isNaN(price) || price < 0) {
      newErrors.price = "시작 가격을 입력해주세요.";
    }
    if (!detail.trim()) newErrors.detail = "상세 설명을 입력해주세요.";
    if (productStatus === null)
      newErrors.productStatus = "상품 상태를 선택해주세요.";
    if (startTime.hour === 0 && startTime.minute === 0)
      newErrors.startTime = "경매 시작 시간을 설정해주세요.";
    if (durationTime.hour === 0 && durationTime.minute === 0)
      newErrors.durationTime = "경매 시간을 설정해주세요.";
    if (!agreed) newErrors.agreed = "판매 동의에 체크해주세요.";
    if (images.length > 10)
      newErrors.images = "이미지는 최대 10장까지 등록 가능합니다.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorKey = Object.keys(newErrors)[0];
      const ref = refs[firstErrorKey as keyof typeof refs];
      if (ref?.current) {
        ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return false;
    }
    return true;
  };

  const handleValidationAndOpenModal = () => {
    if (validateForm()) {
      setIsModalOpen(true);
    }
  };

  const handleSubmit = async () => {
    // 이미 제출 중이면 무시
    if (isSubmitting) return;
    setIsSubmitting(true);

    const startDelay = startTime.hour * 60 + startTime.minute;
    const duration = durationTime.hour * 60 + durationTime.minute;

    // 대표 이미지를 가장 앞으로 재정렬
    const reorderedImages = [
      images[mainImageIndex],
      ...images.filter((_, i) => i !== mainImageIndex),
    ];

    try {
      const uploadedStoreNames: string[] = [];

      // presigned URL 요청 및 S3 업로드
      for (const file of reorderedImages) {
        const { presignedUrl, storeName } = await getPresignedUrl(file);
        await uploadToS3(file, presignedUrl);
        uploadedStoreNames.push(storeName);
      }

      const payload = {
        title,
        description: detail,
        basePrice: Number(price),
        itemCondition: convertLabelToServerValue(
          productConditions[productStatus!]
        ),
        startDelay,
        durationTime: duration,
        category: {
          id: category.id,
          mainCategory: category.mainCategory,
          subCategory: category.subCategory,
          detailCategory: category.detailCategory,
        },
        images: uploadedStoreNames.map((storeName, index) => ({
          storeName,
          originalName: reorderedImages[index].name,
          imageSeq: index,
        })),
      };

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auctions`,
        payload,
        { withCredentials: true }
      );

      toast.success("경매 물품 등록이 완료되었습니다!");
      setIsModalOpen(false);
      router.push(`/detail/${res?.data?.data?.auctionId}`);
    } catch (error: unknown) {
      toast.error("등록에 실패했습니다. 다시 시도해주세요.");
      if (error instanceof AxiosError) {
        console.error("서버 응답 내용:", error.response?.data);
      } else {
        console.error("기타 에러:", error);
      }
    }
  };

  return (
    <div className="max-w-[1280px] p-8 mx-auto">
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <div ref={refs.images} className="flex flex-col pb-[55px]">
          <ImageUploader
            value={images}
            onChange={setImages}
            onEmptyImage={() =>
              toast.error("최소 1장의 이미지를 등록해주세요.")
            }
            mainImageIndex={mainImageIndex}
            onChangeMainImageIndex={setMainImageIndex}
            data-testid="image-uploader"
          />
          {errors.images && (
            <p className="text-warningkeword text-sm">{errors.images}</p>
          )}
        </div>

        <div ref={refs.title} className="flex flex-col pb-[39px]">
          <AuctionTitleInput
            value={title}
            onChange={setTitle}
            data-testid="auction-title"
          />

          {errors.title && (
            <p className="text-warningkeword text-sm">{errors.title}</p>
          )}
        </div>

        <div ref={refs.category} className="flex flex-col pb-[20px]">
          <CategorySelector
            value={category}
            onChange={setCategory}
            data-testid="category-selector"
          />

          {errors.category && (
            <p className="text-warningkeword text-sm">{errors.category}</p>
          )}
        </div>

        <div ref={refs.price} className="flex flex-col pb-[20px]">
          <PaymentInput
            value={price}
            onChange={setPrice}
            data-testid="payment-input"
          />

          {errors.price && (
            <p className="text-warningkeword text-sm">{errors.price}</p>
          )}
        </div>

        <div ref={refs.detail} className="flex flex-col pb-[38px]">
          <DetailedInput
            value={detail}
            onChange={setDetail}
            data-testid="description"
          />

          {errors.detail && (
            <p className="text-warningkeword text-sm">{errors.detail}</p>
          )}
        </div>

        <div ref={refs.productStatus} className="flex flex-col pb-[75px]">
          <ProductStatus
            value={productStatus}
            onChange={setProductStatus}
            data-testid="product-status"
          />

          {errors.productStatus && (
            <p className="text-warningkeword text-sm">{errors.productStatus}</p>
          )}
        </div>

        <div className="flex justify-center flex-nowrap pb-[240px] gap-10">
          <div ref={refs.startTime} className="flex flex-col items-center">
            <AuctionStartTimeButton
              value={startTime}
              onChange={setStartTime}
              data-testid="start-time"
            />
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
              data-testid="duration-time"
            />
            {errors.durationTime && (
              <p className="text-warningkeword text-sm mt-1">
                {errors.durationTime}
              </p>
            )}
          </div>
        </div>

        <div ref={refs.agreed} className="flex justify-center">
          <SellerAgreementCheckbox
            onChange={setAgreed}
            data-testid="agreement-checkbox"
          />
        </div>
        {errors.agreed && (
          <p className="text-warningkeword text-sm text-center">
            {errors.agreed}
          </p>
        )}

        <div className="flex justify-center pt-[20px]">
          <SellButton
            label="등록하기"
            isModalOpen={isModalOpen}
            onClick={handleValidationAndOpenModal}
            onModalClose={() => setIsModalOpen(false)}
            onConfirm={handleSubmit}
            confirmDisabled={isSubmitting}
            data-testid="register-submit-button"
          />
        </div>
      </form>
    </div>
  );
}
