package com.ajith.drinkit.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ajith.drinkit.entity.Category;
import com.ajith.drinkit.service.CategoryService;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(
            CategoryService categoryService) {

        this.categoryService = categoryService;
    }

    // =========================
    // CREATE CATEGORY
    // =========================

    @PostMapping
    public ResponseEntity<Category> createCategory(
            @RequestBody Category category) {

        return new ResponseEntity<>(
                categoryService.createCategory(category),
                HttpStatus.CREATED);
    }

    // =========================
    // GET ALL CATEGORIES
    // =========================

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {

        return ResponseEntity.ok(
                categoryService.getAllCategories());
    }

    // =========================
    // GET CATEGORY BY ID
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                categoryService.getCategoryById(id));
    }

    // =========================
    // UPDATE CATEGORY
    // =========================

    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(
            @PathVariable Long id,
            @RequestBody Category category) {

        return ResponseEntity.ok(
                categoryService.updateCategory(
                        id,
                        category));
    }

    // =========================
    // DELETE CATEGORY
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(
            @PathVariable Long id) {

        categoryService.deleteCategory(id);

        return ResponseEntity.noContent().build();
    }
}