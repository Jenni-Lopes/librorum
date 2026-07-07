import { Router } from "express";
import {
  deletarReview,
  listarMinhasReviews,
  listarReviews,
  salvarReview,
} from "../controllers/review.controller";

const router = Router();

router.get("/me", listarMinhasReviews);
router.get("/:googleBookId", listarReviews);
router.post("/", salvarReview);
router.delete("/:id", deletarReview);

export default router;
