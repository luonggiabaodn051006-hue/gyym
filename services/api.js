import axios from "axios";
import {
  initialClasses as defaultClasses,
  money,
  packages,
  products as defaultProducts,
} from "../data";

const apiClient = axios.create({
  timeout: 12000,
  headers: {
    "Content-Type": "application/json",
  },
});

const FALLBACK_QUOTES = [
  {
    id: "local-1",
    quote: "Kỷ luật mỗi ngày tạo nên sự thay đổi bền vững cho cơ thể và tinh thần.",
    author: "FITNESS Studio",
  },
  {
    id: "local-2",
    quote: "Không cần bắt đầu hoàn hảo, chỉ cần bắt đầu đều đặn từng buổi tập.",
    author: "HLV Minh Quân",
  },
  {
    id: "local-3",
    quote: "Hít thở sâu, giữ nhịp ổn định và lắng nghe cơ thể trong từng chuyển động.",
    author: "HLV Thanh Mai",
  },
];

export async function fetchFitnessQuotes() {
  try {
    const response = await apiClient.get("https://dummyjson.com/quotes?limit=3");
    const quotes = response.data?.quotes;
    if (Array.isArray(quotes) && quotes.length > 0) {
      return { ok: true, source: "dummyjson.com", items: quotes };
    }
    return { ok: true, source: "local", items: FALLBACK_QUOTES };
  } catch {
    return { ok: false, source: "local", items: FALLBACK_QUOTES };
  }
}

export async function postOrderToApi(order) {
  try {
    const response = await apiClient.post(
      "https://jsonplaceholder.typicode.com/posts",
      {
        title: `FITNESS Order ${order.id}`,
        body: JSON.stringify({
          customer: order.customer,
          total: order.total,
          itemsCount: order.items.length,
        }),
        userId: 1,
      },
    );
    return {
      ok: true,
      apiId: response.data?.id ?? 101,
      data: response.data,
    };
  } catch (error) {
    return {
      ok: false,
      error: error?.message || "Không kết nối được API từ xa.",
    };
  }
}

export async function postConsultationForm(formData) {
  const response = await apiClient.post(
    "https://jsonplaceholder.typicode.com/posts",
    {
      ...formData,
      submittedAt: new Date().toISOString(),
    },
  );
  return response.data;
}

function buildLocalReply(
  userMessage,
  productList = defaultProducts,
  classList = defaultClasses,
) {
  const text = userMessage.toLocaleLowerCase("vi").trim();

  const matchedProducts = productList.filter(
    (p) =>
      text.includes(p.name.toLocaleLowerCase("vi")) ||
      (p.id === "bottle" && text.includes("bình")) ||
      (p.id === "dumbbell" && text.includes("tạ")) ||
      (p.id === "mat" && (text.includes("thảm") || text.includes("yoga"))) ||
      (p.id === "bag" && text.includes("túi")) ||
      (p.id === "rope" && text.includes("dây nhảy")) ||
      (p.id === "towel" && text.includes("khăn")),
  );

  if (matchedProducts.length > 0) {
    const item = matchedProducts[0];
    return {
      text: `${item.name} (${item.category}) có giá ${money(item.price)}. ${item.description} (${(item.details || []).join(", ")}). Bạn có thể bấm nút bên dưới để thêm ngay vào giỏ nhé!`,
      mode: "Trợ lý Studio",
      actions: [
        { type: "add_cart", productId: item.id, label: `+ Thêm ${item.name}` },
        { type: "link", to: `/cua-hang/${item.id}`, label: "Xem chi tiết" },
      ],
    };
  }

  if (
    text.includes("gói") ||
    text.includes("thẻ") ||
    text.includes("hội viên") ||
    text.includes("basic") ||
    text.includes("plus") ||
    text.includes("pro")
  ) {
    const summary = packages
      .map(
        (pkg) =>
          `• Gói ${pkg.name} (${pkg.months} tháng): ${money(pkg.price)} — ${pkg.features.join(", ")}`,
      )
      .join("\n");
    return {
      text: `FITNESS Studio hiện có 3 gói tập linh hoạt:\n${summary}\n\nGói Plus (3 tháng) đang được nhiều hội viên chọn nhất vì có sẵn lớp nhóm và 1 buổi PT kèm 1-1.`,
      mode: "Trợ lý Studio",
      actions: [
        { type: "link", to: "/goi-tap", label: "Xem bảng gói tập" },
        { type: "link", to: "/thanh-toan?goi=plus", label: "Đăng ký gói Plus" },
      ],
    };
  }

  if (
    text.includes("sản phẩm") ||
    text.includes("dụng cụ") ||
    text.includes("phụ kiện") ||
    text.includes("cửa hàng") ||
    text.includes("giá") ||
    text.includes("mua")
  ) {
    const list = productList
      .map((p) => `• ${p.name}: ${money(p.price)}`)
      .join("\n");
    const firstProd = productList[0];
    return {
      text: `Danh mục dụng cụ & phụ kiện tại FITNESS Studio (${productList.length} món):\n${list}\n\nTất cả đều nhận trực tiếp tại quầy lễ tân phòng tập.`,
      mode: "Trợ lý Studio",
      actions: [
        { type: "link", to: "/cua-hang", label: "Mở Cửa hàng" },
        ...(firstProd
          ? [
              {
                type: "add_cart",
                productId: firstProd.id,
                label: `+ Thêm ${firstProd.name}`,
              },
            ]
          : []),
      ],
    };
  }

  if (
    text.includes("lịch") ||
    text.includes("lớp") ||
    text.includes("giờ") ||
    text.includes("hlv") ||
    text.includes("cardio") ||
    text.includes("zumba")
  ) {
    const scheduleLines = classList
      .map(
        (c) =>
          `• ${c.day} (${c.time}): ${c.name} — HLV ${c.coach} (tối đa ${c.capacity} học viên)`,
      )
      .join("\n");
    return {
      text: `Lịch lớp nhóm hàng tuần tại FITNESS Studio:\n${scheduleLines}`,
      mode: "Trợ lý Studio",
      actions: [{ type: "link", to: "/lich-tap", label: "Đăng ký lịch tập" }],
    };
  }

  if (
    text.includes("thanh toán") ||
    text.includes("qr") ||
    text.includes("chuyển khoản") ||
    text.includes("nhận hàng") ||
    text.includes("đơn")
  ) {
    return {
      text: "Quy trình đặt hàng rất gọn: Thêm sản phẩm hoặc chọn gói tập → Điền thông tin ở trang Thanh toán → Quét mã QR chuyển khoản và chờ Admin xác nhận giao dịch.",
      mode: "Trợ lý Studio",
      actions: [
        { type: "link", to: "/gio-hang", label: "Xem Giỏ hàng" },
        { type: "link", to: "/don-hang", label: "Tra cứu Đơn hàng" },
      ],
    };
  }

  return {
    text: "Chào bạn! Mình là trợ lý của FITNESS Studio. Mình có thể giúp bạn tra cứu gói tập (Basic/Plus/Pro), báo giá dụng cụ tập luyện, xem lịch lớp hàng tuần hoặc hỗ trợ đặt hàng nhanh.",
    mode: "Trợ lý Studio",
    actions: [
      { type: "link", to: "/goi-tap", label: "Xem Gói tập" },
      { type: "link", to: "/cua-hang", label: "Ghé Cửa hàng" },
    ],
  };
}

export async function askFitnessAssistant(
  userMessage,
  history = [],
  apiKey = "",
  productList = defaultProducts,
  classList = defaultClasses,
) {
  const cleanKey = (apiKey || import.meta.env.VITE_GEMINI_API_KEY || "").trim();

  if (!cleanKey) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return buildLocalReply(userMessage, productList, classList);
  }

  const catalogContext = [
    "Gói tập FITNESS Studio:",
    ...packages.map(
      (p) =>
        `- ${p.name} (${p.months} tháng): ${money(p.price)} (${p.features.join(", ")})`,
    ),
    "Sản phẩm tại cửa hàng:",
    ...productList.map(
      (p) => `- ${p.name} [${p.category}]: ${money(p.price)} - ${p.description}`,
    ),
    "Lịch lớp hàng tuần:",
    ...classList.map(
      (c) => `- ${c.day} (${c.time}): ${c.name} (HLV ${c.coach})`,
    ),
    "Quy định: Nhận hàng trực tiếp tại phòng tập, thanh toán qua chuyển khoản QR.",
  ].join("\n");

  const contents = history.slice(-6).map((msg) => ({
    role: msg.sender === "user" ? "user" : "model",
    parts: [{ text: msg.text }],
  }));
  contents.push({
    role: "user",
    parts: [{ text: userMessage }],
  });

  try {
    const response = await apiClient.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(cleanKey)}`,
      {
        systemInstruction: {
          parts: [
            {
              text: `Bạn là trợ lý tư vấn nhiệt tình, ngắn gọn của phòng tập & cửa hàng phụ kiện thể thao FITNESS Studio. Trả lời bằng tiếng Việt tự nhiên, súc tích (tối đa 4-5 câu), dựa trên dữ liệu thực tế sau:\n${catalogContext}`,
            },
          ],
        },
        contents,
      },
    );

    const aiText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (aiText) {
      const localHints = buildLocalReply(userMessage, productList, classList);
      return {
        text: aiText,
        mode: "Gemini 2.5 Flash",
        actions: localHints.actions || [],
      };
    }

    return buildLocalReply(userMessage, productList, classList);
  } catch (error) {
    const fallback = buildLocalReply(userMessage, productList, classList);
    const status = error?.response?.status;
    const reason =
      status === 400 || status === 401 || status === 403
        ? "API Key không hợp lệ hoặc hết quyền"
        : "Không kết nối được Gemini API";
    return {
      ...fallback,
      mode: `Local (${reason})`,
    };
  }
}
