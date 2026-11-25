// DANH MỤC MẶC ĐỊNH: 20 sản phẩm thật kèm ảnh chụp sản phẩm, đánh giá & lượt bán.
export const packages = [
  {
    id: "basic",
    name: "Basic",
    months: 1,
    price: 350000,
    description: "Bắt đầu thói quen tập luyện.",
    features: ["Khu tập gym", "Khu cardio", "Tủ đồ trong buổi tập"],
  },
  {
    id: "plus",
    name: "Plus",
    months: 3,
    price: 900000,
    description: "Dành thời gian cho chính mình.",
    features: [
      "Toàn bộ quyền lợi Basic",
      "Lớp tập nhóm",
      "1 buổi hướng dẫn với PT",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    months: 6,
    price: 1600000,
    description: "Theo đuổi mục tiêu dài hạn.",
    features: [
      "Toàn bộ quyền lợi Plus",
      "4 buổi hướng dẫn với PT",
      "Đánh giá thể lực định kỳ",
    ],
  },
];

export const products = [
  {
    id: "bottle",
    name: "Bình nước thể thao cách nhiệt FITNESS 750ml",
    category: "Phụ kiện",
    price: 149000,
    originalPrice: 189000,
    rating: 4.9,
    sold: 1420,
    label: "YÊU THÍCH",
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",
    description:
      "Bình nước giữ nhiệt inox 304 sơn tĩnh điện chống trượt, nắp bật khóa chống tràn tiện lợi khi mang đi tập gym và chạy bộ.",
    details: ["Dung tích 750 ml", "Inox 304 giữ lạnh 12h", "Nắp bật kèm quai xách"],
    maxQuantity: 10,
  },
  {
    id: "dumbbell",
    name: "Cặp tạ tay bọc cao su lục giác chống lăn 2kg – 5kg",
    category: "Dụng cụ",
    price: 390000,
    originalPrice: 460000,
    rating: 4.9,
    sold: 980,
    label: "BÁN CHẠY",
    image:
      "https://images.unsplash.com/photo-1586401100295-7a8096fd231a?auto=format&fit=crop&w=800&q=80",
    description:
      "Bộ 2 tạ tay lõi gang đúc bọc cao su nguyên sinh êm ái, đầu lục giác chống lăn an toàn cho sàn nhà và phòng tập.",
    details: ["1 bộ gồm 2 quả tạ", "Tay cầm nhám chống trượt", "Bọc cao su giảm chấn"],
    maxQuantity: 10,
  },
  {
    id: "mat",
    name: "Thảm tập Yoga TPE 2 lớp định tuyến chống trượt 6mm",
    category: "Dụng cụ",
    price: 259000,
    originalPrice: 320000,
    rating: 4.8,
    sold: 2150,
    label: "YÊU THÍCH",
    image:
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80",
    description:
      "Thảm tập Yoga & Pilates chất liệu TPE đàn hồi cao, bề mặt vân nổi bám sàn tuyệt đối, tặng kèm dây buộc và túi đựng.",
    details: ["Kích thước 183 × 61 cm", "Độ dày chuẩn 6 mm", "Tặng kèm dây đeo thảm"],
    maxQuantity: 10,
  },
  {
    id: "bag",
    name: "Túi trống thể thao Gym & Du lịch ngăn đựng giày riêng",
    category: "Phụ kiện",
    price: 329000,
    originalPrice: 410000,
    rating: 4.9,
    sold: 760,
    label: "BÁN CHẠY",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    description:
      "Túi trống vải Oxford trượt nước cao cấp, tích hợp ngăn để giày thoáng khí và ngăn chống thấm đựng đồ ướt sau buổi tập.",
    details: ["Kích thước 46 × 25 × 24 cm", "Ngăn giày riêng biệt", "Vải trượt nước bền bỉ"],
    maxQuantity: 10,
  },
  {
    id: "rope",
    name: "Dây nhảy tốc độ lõi thép bọc PVC ổ bi xoay 360°",
    category: "Dụng cụ",
    price: 99000,
    originalPrice: 135000,
    rating: 4.8,
    sold: 3120,
    label: "GIÁ TỐT",
    image:
      "https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=800&q=80",
    description:
      "Dây nhảy cardio chuyên dụng cho HIIT và Boxing, trục vòng bi thép xoay mượt không xoắn dây, dễ dàng điều chỉnh chiều dài.",
    details: ["Dây lõi thép dài 3 m", "Vòng bi tốc độ cao", "Tay cầm bọc mút EVA"],
    maxQuantity: 10,
  },
  {
    id: "towel",
    name: "Khăn tập Gym Microfiber siêu thấm hút kháng khuẩn",
    category: "Phụ kiện",
    price: 89000,
    originalPrice: 115000,
    rating: 4.7,
    sold: 1840,
    label: "GỌN NHẸ",
    image:
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80",
    description:
      "Khăn thể thao sợi Microfiber mềm mịn, thấm mồ hôi gấp 3 lần khăn cotton thông thường và khô nhanh không ám mùi.",
    details: ["Kích thước 40 × 80 cm", "Sợi Microfiber siêu mịn", "Có đai treo tiện lợi"],
    maxQuantity: 10,
  },
  {
    id: "kettlebell",
    name: "Tạ ấm Kettlebell gang đúc sơn tĩnh điện 8kg",
    category: "Dụng cụ",
    price: 450000,
    originalPrice: 520000,
    rating: 4.9,
    sold: 540,
    label: "CHUẨN GYM",
    image:
      "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=800&q=80",
    description:
      "Tạ ấm nguyên khối cho các bài tập Swing, Squat, Goblet và đốt mỡ toàn thân, tay cầm rộng thoải mái khi cầm 2 tay.",
    details: ["Trọng lượng 8 kg", "Gang đúc nguyên khối", "Đế phẳng đứng vững"],
    maxQuantity: 10,
  },
  {
    id: "gloves",
    name: "Găng tay tập Gym có cuốn cổ tay bảo vệ khớp",
    category: "Phụ kiện",
    price: 165000,
    originalPrice: 210000,
    rating: 4.8,
    sold: 1290,
    label: "BÁN CHẠY",
    image:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80",
    description:
      "Găng tay hở ngón đệm silicon lòng bàn tay chống chai sạn khi kéo xà, đẩy tạ và tập máy, kèm băng quấn cố định cổ tay.",
    details: ["Size M / L / XL", "Đệm silicon chống trượt", "Lưới thoáng khí mu bàn tay"],
    maxQuantity: 10,
  },
  {
    id: "boxing",
    name: "Găng tay Boxing & Kickfit da PU cao cấp 10oz – 12oz",
    category: "Phụ kiện",
    price: 420000,
    originalPrice: 490000,
    rating: 4.9,
    sold: 630,
    label: "YÊU THÍCH",
    image:
      "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=800&q=80",
    description:
      "Găng đấm bốc 3 lớp mút hấp thụ xung lực bảo vệ khớp ngón tay, lỗ thoát khí lòng bàn tay phù hợp tập bao cát và đối kháng.",
    details: ["Da tổng hợp microfiber bền bỉ", "Đệm mút 3 lớp dày dặn", "Khóa dán Velcro chắc chắn"],
    maxQuantity: 10,
  },
  {
    id: "bands",
    name: "Bộ 5 dây kháng lực tập mông đùi & phục hồi cơ",
    category: "Dụng cụ",
    price: 179000,
    originalPrice: 240000,
    rating: 4.9,
    sold: 2680,
    label: "HOT",
    image:
      "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=80",
    description:
      "Set 5 mức kháng lực từ nhẹ đến siêu nặng bằng cao su tự nhiên 100%, tập mông đùi, vai và giãn cơ ngay tại nhà.",
    details: ["5 mức lực 5lbs – 40lbs", "Cao su tự nhiên đàn hồi", "Kèm túi lưới mang theo"],
    maxQuantity: 10,
  },
  {
    id: "shaker",
    name: "Bình lắc Whey Shaker 700ml kèm bóng lò xo inox",
    category: "Phụ kiện",
    price: 119000,
    originalPrice: 150000,
    rating: 4.8,
    sold: 1750,
    label: "TIỆN LỢI",
    image:
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=800&q=80",
    description:
      "Bình pha Whey Protein và BCAA nhựa Tritan không chứa BPA, vạch chia ml rõ nét và bi lắc inox đánh tan bột cực mịn.",
    details: ["Dung tích 700 ml", "Nhựa an toàn BPA-Free", "Kèm bóng lò xo inox 316"],
    maxQuantity: 10,
  },
  {
    id: "whey",
    name: "Whey Protein Isolate 2lbs (907g) Hương Socola",
    category: "Dinh dưỡng",
    price: 890000,
    originalPrice: 1050000,
    rating: 4.9,
    sold: 890,
    label: "CHÍNH HÃNG",
    image:
      "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=800&q=80",
    description:
      "Nguồn đạm tinh khiết hấp thu nhanh 25g Protein và 5.5g BCAA mỗi muỗng, hỗ trợ phục hồi và phát triển cơ bắp nạc tối ưu.",
    details: ["25g Protein / Serving", "Ít đường & chất béo", "28 lần dùng / hộp"],
    maxQuantity: 10,
  },
  {
    id: "roller",
    name: "Con lăn giãn cơ Foam Roller gai nổi 33cm",
    category: "Dụng cụ",
    price: 215000,
    originalPrice: 270000,
    rating: 4.8,
    sold: 910,
    label: "PHỤC HỒI",
    image:
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&q=80",
    description:
      "Ống lăn massage giải tỏa căng cứng cơ lưng, đùi và bắp chân sau buổi tập nặng, lõi nhựa PVC chịu tải trọng tới 150kg.",
    details: ["Chiều dài 33 cm", "Mút EVA mật độ cao", "Chịu lực 150 kg"],
    maxQuantity: 10,
  },
  {
    id: "plate",
    name: "Bánh tạ gang bọc cao su lỗ phi 50mm (5kg)",
    category: "Dụng cụ",
    price: 340000,
    originalPrice: 390000,
    rating: 4.9,
    sold: 410,
    label: "CHUẨN OLYMPIC",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    description:
      "Đĩa tạ Olympic lỗ 50mm thiết kế 3 tay nắm tiện cầm tập rời hoặc lắp đòn tạ, bọc cao su chống ồn và bảo vệ sàn.",
    details: ["Trọng lượng 5 kg / bánh", "Lỗ tiêu chuẩn 50 mm", "Thiết kế 3 tay cầm"],
    maxQuantity: 10,
  },
  {
    id: "pullup",
    name: "Xà đơn gắn cửa đa năng chịu lực 200kg không cần khoan",
    category: "Dụng cụ",
    price: 310000,
    originalPrice: 380000,
    rating: 4.8,
    sold: 1520,
    label: "TẬP TẠI NHÀ",
    image:
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&q=80",
    description:
      "Thanh xà đơn thép dày 2mm có khóa chống xoay và đệm silicon bám khung cửa, tập lưng xô, tay trước và treo người giãn cột sống.",
    details: ["Điều chỉnh 72 – 110 cm", "Chịu tải tối đa 200 kg", "Mút cầm tay chống chai"],
    maxQuantity: 10,
  },
  {
    id: "shirt",
    name: "Áo thun thể thao nam nữ Dry-Fit co giãn 4 chiều",
    category: "Trang phục",
    price: 195000,
    originalPrice: 250000,
    rating: 4.8,
    sold: 1640,
    label: "MỚI",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    description:
      "Áo tập chất vải Poly-Spandex siêu nhẹ thoát nhiệt tức thì, form Athletic tôn dáng vai ngực và thoải mái mọi biên độ chuyển động.",
    details: ["Size S / M / L / XL", "Vải thoáng khí nhanh khô", "Co giãn 4 chiều"],
    maxQuantity: 10,
  },
  {
    id: "shoes",
    name: "Giày chạy bộ & tập Gym đế êm giảm chấn siêu nhẹ",
    category: "Trang phục",
    price: 790000,
    originalPrice: 950000,
    rating: 4.9,
    sold: 720,
    label: "BÁN CHẠY",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    description:
      "Giày thể thao thân dệt Mesh thoáng khí kết hợp đế đệm EVA đàn hồi cao, bám sàn tốt khi tập tạ, chạy máy và cardio.",
    details: ["Size 38 – 44", "Trọng lượng siêu nhẹ 240g", "Đế cao su chống trượt"],
    maxQuantity: 10,
  },
  {
    id: "watch",
    name: "Đồng hồ thể thao đo nhịp tim & đếm calo kháng nước",
    category: "Phụ kiện",
    price: 690000,
    originalPrice: 850000,
    rating: 4.8,
    sold: 610,
    label: "CÔNG NGHỆ",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    description:
      "Theo dõi nhịp tim 24/7, lượng calo tiêu thụ, bấm giờ hiệp tập HIIT và chuẩn kháng nước 5ATM cho người yêu vận động.",
    details: ["Pin dùng tới 10 ngày", "Kháng nước 5ATM", "Hơn 20 chế độ tập luyện"],
    maxQuantity: 10,
  },
  {
    id: "proteinbar",
    name: "Hộp 12 thanh Protein Bar năng lượng hạt & yến mạch",
    category: "Dinh dưỡng",
    price: 290000,
    originalPrice: 340000,
    rating: 4.8,
    sold: 1130,
    label: "ĂN NHẸ",
    image:
      "https://images.unsplash.com/photo-1622484212850-eb596d769edc?auto=format&fit=crop&w=800&q=80",
    description:
      "Bữa phụ dinh dưỡng trước hoặc sau buổi tập cung cấp 15g đạm từ hạt hạnh nhân, yến mạch và whey protein, không đường tinh luyện.",
    details: ["Hộp 12 thanh × 50g", "15g Protein mỗi thanh", "Tiện mang theo túi tập"],
    maxQuantity: 10,
  },
  {
    id: "yogablock",
    name: "Bộ 2 gạch tập Yoga EVA mật độ cao hỗ trợ thăng bằng",
    category: "Dụng cụ",
    price: 129000,
    originalPrice: 160000,
    rating: 4.9,
    sold: 1380,
    label: "YOGA",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
    description:
      "Cặp gạch hỗ trợ thực hiện chuẩn xác các tư thế giãn cơ và giữ thăng bằng trong Yoga & Pilates, bo cạnh êm tay.",
    details: ["Bộ 2 viên gạch", "Kích thước 23 × 15 × 7.5 cm", "Xốp EVA nhẹ chống lún"],
    maxQuantity: 10,
  },
];

export const initialClasses = [
  {
    id: 1,
    name: "Yoga cơ bản",
    coach: "Thanh Mai",
    day: "Thứ 2",
    time: "06:00 - 07:00",
    capacity: 15,
  },
  {
    id: 2,
    name: "Tập toàn thân",
    coach: "Minh Quân",
    day: "Thứ 3",
    time: "17:30 - 18:30",
    capacity: 20,
  },
  {
    id: 3,
    name: "Cardio",
    coach: "Quốc Bảo",
    day: "Thứ 5",
    time: "18:00 - 19:00",
    capacity: 15,
  },
  {
    id: 4,
    name: "Zumba",
    coach: "Ngọc Hà",
    day: "Thứ 7",
    time: "08:00 - 09:00",
    capacity: 20,
  },
];

export const money = (value) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    value,
  );

export function createSampleMembers() {
  return [
    { id: 1, name: "Nguyễn Minh Anh", packageName: "Basic" },
    { id: 2, name: "Trần Hoàng Nam", packageName: "Plus" },
    { id: 3, name: "Lê Thảo Vy", packageName: "Pro" },
  ];
}
