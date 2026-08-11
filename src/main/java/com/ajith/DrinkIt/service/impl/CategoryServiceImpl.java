package com.ajith.drinkit.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ajith.drinkit.entity.Category;
import com.ajith.drinkit.exception.ResourceNotFoundException;
import com.ajith.drinkit.repository.CategoryRepository;
import com.ajith.drinkit.service.CategoryService;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(
            CategoryRepository categoryRepository) {

        this.categoryRepository = categoryRepository;
    }

    // =========================
    // CREATE CATEGORY
    // =========================

    @Override
    public Category createCategory(Category category) {

        if (category == null ||
                category.getName() == null ||
                category.getName().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Category name is required");
        }

        String name = category.getName().trim();

        if (categoryRepository.existsByName(name)) {

            throw new IllegalArgumentException(
                    "Category already exists");
        }

        category.setName(name);

        return categoryRepository.save(category);
    }

    // =========================
    // GET ALL CATEGORIES
    // =========================

    @Override
    public List<Category> getAllCategories() {

        return categoryRepository.findAll();
    }

    // =========================
    // GET CATEGORY BY ID
    // =========================

    @Override
    public Category getCategoryById(Long id) {

        return categoryRepository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found"));
    }

    // =========================
    // UPDATE CATEGORY
    // =========================

    @Override
    public Category updateCategory(
            Long id,
            Category category) {

        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found"));

        if (category == null ||
                category.getName() == null ||
                category.getName().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Category name is required");
        }

        String name = category.getName().trim();

        if (categoryRepository
                .existsByNameAndIdNot(name, id)) {

            throw new IllegalArgumentException(
                    "Category with this name already exists");
        }

        existingCategory.setName(name);
        existingCategory.setDescription(
                category.getDescription());
        existingCategory.setImageUrl(
                category.getImageUrl());
        existingCategory.setActive(
                category.getActive());

        return categoryRepository.save(existingCategory);
    }

    // =========================
    // DELETE CATEGORY
    // =========================

    @Override
    public void deleteCategory(Long id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found"));

        try {

            categoryRepository.delete(category);

        } catch (Exception e) {

            throw new RuntimeException(
                    "Cannot delete category because it is associated with existing products.");
        }
    }
}