const express = require("express");
const router = express.Router();
const {
  searchNotes,
  getSearchSuggestions,
  getPopularSearches,
  advancedSearch,
  getFilterOptions,
} = require("../controllers/searchController");

// @route   GET /api/search/notes
// @desc    Search notes
// @access  Public
router.get("/notes", searchNotes);

// @route   GET /api/search/suggestions
// @desc    Get search suggestions
// @access  Public
router.get("/suggestions", getSearchSuggestions);

// @route   GET /api/search/popular
// @desc    Get popular search terms
// @access  Public
router.get("/popular", getPopularSearches);

// @route   GET /api/search/filters
// @desc    Get filter options for search
// @access  Public
router.get("/filters", getFilterOptions);

// @route   POST /api/search/advanced
// @desc    Advanced search with multiple filters
// @access  Public
router.post("/advanced", advancedSearch);

module.exports = router;
