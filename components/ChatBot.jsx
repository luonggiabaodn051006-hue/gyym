import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Collapse,
  Divider,
  Fab,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Zoom,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { askFitnessAssistant } from "../services/api";
import { useAppContext } from "../context/AppContext";

const KEY_STORAGE = "fitness_gemini_api_key_v1";

const QUICK_PROMPTS = [
  "Tư vấn gói tập phù hợp",
  "Xem bảng giá dụng cụ",
  "Lịch lớp tuần này",
  "Cách thanh toán QR",
];

const INITIAL_MESSAGES = [
  {
    id: "welcome-1",
    sender: "bot",
    text: "Xin chào! Mình là trợ lý AI của FITNESS Studio. Bạn cần tư vấn gói tập, chọn dụng cụ hay xem lịch lớp hôm nay?",
    mode: "Trợ lý Studio",
    actions: [
      { type: "link", to: "/goi-tap", label: "Xem Gói tập" },
      { type: "link", to: "/cua-hang", label: "Ghé Cửa hàng" },
    ],
  },
];

export default function ChatBot({ products, classes, onAdd }) {
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  const [open, setOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    try {
      return localStorage.getItem(KEY_STORAGE) || "";
    } catch {
      return "";
    }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);

  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, open]);

  function handleSaveKey(value) {
    setApiKey(value);
    try {
      if (value.trim()) {
        localStorage.setItem(KEY_STORAGE, value.trim());
      } else {
        localStorage.removeItem(KEY_STORAGE);
      }
    } catch {
      // Bỏ qua nếu trình duyệt chặn storage
    }
  }

  async function handleSend(customText) {
    const raw = typeof customText === "string" ? customText : input;
    const text = raw.trim();
    if (!text || loading) return;

    const userMsg = {
      id: crypto.randomUUID(),
      sender: "user",
      text,
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    if (typeof customText !== "string") {
      setInput("");
    }
    setLoading(true);

    const reply = await askFitnessAssistant(text, nextHistory, apiKey, products, classes);

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        sender: "bot",
        text: reply.text,
        mode: reply.mode,
        actions: reply.actions || [],
      },
    ]);
    setLoading(false);
  }

  function handleActionClick(action) {
    if (action.type === "add_cart" && onAdd) {
      const res = onAdd(action.productId);
      showToast(res.message, res.ok ? "success" : "warning");
      return;
    }
    if (action.type === "link" && action.to) {
      navigate(action.to);
      setOpen(false);
    }
  }

  function handleClearChat() {
    setMessages(INITIAL_MESSAGES);
  }

  return (
    <Box
      sx={{
        position: "fixed",
        right: { xs: 16, sm: 24 },
        bottom: { xs: 16, sm: 24 },
        zIndex: 1300,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      }}
    >
      <Zoom in={open} unmountOnExit>
        <Paper
          elevation={8}
          sx={{
            width: { xs: "calc(100vw - 32px)", sm: 380 },
            maxWidth: 400,
            height: 520,
            maxHeight: "calc(100vh - 104px)",
            mb: 1.5,
            borderRadius: 3,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            border: 1,
            borderColor: "divider",
          }}
        >
          {/* Header khung chat */}
          <Box
            sx={{
              bgcolor: "#263f2a",
              color: "#f4f8ee",
              px: 2,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                  bgcolor: "#d8eb9b",
                  color: "#1c281d",
                }}
              >
                <SmartToyOutlinedIcon fontSize="small" />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  FITNESS AI Assistant
                </Typography>
                <Typography variant="caption" sx={{ color: "#bfd0b3", display: "block" }}>
                  {apiKey.trim() || import.meta.env.VITE_GEMINI_API_KEY
                    ? "● Gemini 2.5 Flash sẵn sàng"
                    : "● Trợ lý tư vấn nhanh 24/7"}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={0.5}>
              <Tooltip title="Cài đặt Gemini API Key">
                <IconButton
                  size="small"
                  onClick={() => setShowSettings((prev) => !prev)}
                  sx={{ color: "#e5eddc" }}
                  aria-label="Cài đặt Gemini API Key"
                >
                  <SettingsOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Xóa đoạn chat">
                <IconButton
                  size="small"
                  onClick={handleClearChat}
                  sx={{ color: "#e5eddc" }}
                  aria-label="Xóa lịch sử trò chuyện"
                >
                  <DeleteSweepOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Thu nhỏ">
                <IconButton
                  size="small"
                  onClick={() => setOpen(false)}
                  sx={{ color: "#e5eddc" }}
                  aria-label="Đóng khung chat"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          {/* Thanh cấu hình Gemini API Key (tùy chọn) */}
          <Collapse in={showSettings}>
            <Box
              sx={{
                p: 1.5,
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "#1c261e" : "#eef3e4",
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.75 }}>
                Nhập Gemini API Key (tùy chọn) để bật trả lời AI tự do; để trống vẫn dùng trợ lý Studio bình thường:
              </Typography>
              <TextField
                size="small"
                fullWidth
                type="password"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => handleSaveKey(e.target.value)}
                sx={{ bgcolor: "background.paper", borderRadius: 1 }}
              />
            </Box>
          </Collapse>

          {/* Danh sách tin nhắn */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              bgcolor: "background.default",
            }}
          >
            {messages.map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <Box
                  key={msg.id}
                  sx={{
                    alignSelf: isUser ? "flex-end" : "flex-start",
                    maxWidth: "85%",
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      px: 1.75,
                      py: 1.25,
                      borderRadius: isUser
                        ? "14px 14px 4px 14px"
                        : "14px 14px 14px 4px",
                      bgcolor: isUser ? "#263f2a" : "background.paper",
                      color: isUser ? "#ffffff" : "text.primary",
                      border: isUser ? "none" : 1,
                      borderColor: "divider",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ whiteSpace: "pre-line", lineHeight: 1.55 }}
                    >
                      {msg.text}
                    </Typography>

                    {!isUser && msg.actions?.length > 0 && (
                      <Stack
                        direction="row"
                        spacing={0.75}
                        flexWrap="wrap"
                        useFlexGap
                        sx={{ mt: 1.25 }}
                      >
                        {msg.actions.map((act, idx) => (
                          <Button
                            key={idx}
                            size="small"
                            variant={act.type === "add_cart" ? "contained" : "outlined"}
                            color={act.type === "add_cart" ? "secondary" : "primary"}
                            startIcon={
                              act.type === "add_cart" ? (
                                <AddShoppingCartIcon sx={{ fontSize: 14 }} />
                              ) : (
                                <ArrowOutwardIcon sx={{ fontSize: 14 }} />
                              )
                            }
                            onClick={() => handleActionClick(act)}
                            sx={{
                              fontSize: 11,
                              py: 0.4,
                              px: 1.1,
                              borderRadius: "14px",
                            }}
                          >
                            {act.label}
                          </Button>
                        ))}
                      </Stack>
                    )}
                  </Paper>

                  {!isUser && msg.mode && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ ml: 0.5, fontSize: 10 }}
                    >
                      {msg.mode}
                    </Typography>
                  )}
                </Box>
              );
            })}

            {loading && (
              <Box sx={{ alignSelf: "flex-start" }}>
                <Paper
                  elevation={0}
                  sx={{
                    px: 1.75,
                    py: 1,
                    borderRadius: "14px 14px 14px 4px",
                    border: 1,
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Đang soạn phản hồi…
                  </Typography>
                </Paper>
              </Box>
            )}

            <div ref={bottomRef} />
          </Box>

          {/* Gợi ý câu hỏi nhanh */}
          <Box
            sx={{
              px: 1.5,
              py: 1,
              bgcolor: "background.paper",
              borderTop: 1,
              borderColor: "divider",
              display: "flex",
              gap: 0.75,
              overflowX: "auto",
            }}
          >
            {QUICK_PROMPTS.map((q) => (
              <Chip
                key={q}
                label={q}
                size="small"
                clickable
                onClick={() => handleSend(q)}
                sx={{ flexShrink: 0, fontSize: 11 }}
              />
            ))}
          </Box>

          <Divider />

          {/* Ô nhập tin nhắn */}
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            sx={{ p: 1.25, bgcolor: "background.paper" }}
          >
            <TextField
              size="small"
              fullWidth
              placeholder="Hỏi về gói tập, tạ tay, lịch tập..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="submit"
                      color="primary"
                      size="small"
                      disabled={!input.trim() || loading}
                      aria-label="Gửi tin nhắn"
                    >
                      <SendIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Paper>
      </Zoom>

      {/* Nút tròn nổi mở ChatBot */}
      <Tooltip title={open ? "Đóng trợ lý" : "Chat tư vấn FITNESS"} placement="left">
        <Fab
          color="primary"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Mở hộp thoại tư vấn FITNESS"
          sx={{
            bgcolor: "#263f2a",
            color: "#d8eb9b",
            "&:hover": {
              bgcolor: "#38563b",
            },
          }}
        >
          {open ? <CloseIcon /> : <ChatBubbleOutlineIcon />}
        </Fab>
      </Tooltip>
    </Box>
  );
}
