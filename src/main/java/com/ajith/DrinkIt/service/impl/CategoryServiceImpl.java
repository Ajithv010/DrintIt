package com.ajith.drinkit.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ajith.drinkit.entity.Category;
import com.ajith.drinkit.exception.ResourceNotFoundException;
import com.ajith.drinkit.repository.CategoryRepository;
import com.ajith.drinkit.service.CategoryService;

@Service
public class CategoryServiceImpl
                implements CategoryService {

        private final CategoryRepository categoryRepository;

        @Value("${drinkit.upload-dir:DrinkIt-frontend/public/images}")
        private String uploadDirectory;

        public CategoryServiceImpl(
                        CategoryRepository categoryRepository) {

                this.categoryRepository = categoryRepository;
        }

        // =========================
        // CREATE CATEGORY
        // =========================

        @Override
        public Category createCategory(
                        Category category) {

                if (category == null ||
                                category.getName() == null ||
                                category.getName().trim().isEmpty()) {

                        throw new IllegalArgumentException(
                                        "Category name is required");
                }

                String name = category.getName().trim();

                if (categoryRepository
                                .existsByName(name)) {

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
        public Category getCategoryById(
                        Long id) {

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

                Category existingCategory = categoryRepository
                                .findById(id)
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
                                .existsByNameAndIdNot(
                                                name,
                                                id)) {

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

                return categoryRepository.save(
                                existingCategory);
        }

        // =========================
        // DELETE CATEGORY
        // =========================

        @Override
        public void deleteCategory(
                        Long id) {

                Category category = categoryRepository
                                .findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Category not found"));

                try {

                        categoryRepository.delete(category);

                } catch (Exception e) {

                        throw new RuntimeException(
                                        "Cannot delete category because it is associated with existing products.");
                }
        }

        // =========================
        // UPLOAD CATEGORY IMAGE
        // =========================

        @Override
        public String uploadCategoryImage(
                        MultipartFile image) {

                if (image == null ||
                                image.isEmpty()) {

                        throw new IllegalArgumentException(
                                        "Please select an image");
                }

                // =========================
                // FILE SIZE
                // =========================

                if (image.getSize() > 5 * 1024 * 1024) {

                        throw new IllegalArgumentException(
                                        "Image size must be less than 5 MB");
                }

                // =========================
                // FILE TYPE
                // =========================

                String contentType = image.getContentType();

                if (contentType == null ||
                                !(contentType.equalsIgnoreCase(
                                                "image/jpeg")
                                                ||
                                                contentType.equalsIgnoreCase(
                                                                "image/png")
                                                ||
                                                contentType.equalsIgnoreCase(
                                                                "image/webp"))) {

                        throw new IllegalArgumentException(
                                        "Only JPG, PNG and WEBP images are allowed");
                }

                // =========================
                // FILE EXTENSION
                // =========================

                String originalName = image.getOriginalFilename();

                String extension = ".jpg";

                if (originalName != null &&
                                originalName.contains(".")) {

                        extension = originalName.substring(
                                        originalName.lastIndexOf("."))
                                        .toLowerCase();
                }

                // =========================
                // UNIQUE FILE NAME
                // =========================

                String fileName = UUID.randomUUID()
                                .toString()
                                + extension;

                // =========================
                // CREATE DIRECTORY
                // =========================

                Path directory = Paths.get(
                                System.getProperty(
                                                "user.dir"))
                                .resolve(uploadDirectory)
                                .normalize();

                try {

                        Files.createDirectories(
                                        directory);

                        Path target = directory.resolve(
                                        fileName);

                        Files.copy(
                                        image.getInputStream(),
                                        target,
                                        StandardCopyOption.REPLACE_EXISTING);

                        return fileName;

                } catch (IOException e) {

                        throw new RuntimeException(
                                        "Unable to save category image",
                                        e);
                }
        }
}