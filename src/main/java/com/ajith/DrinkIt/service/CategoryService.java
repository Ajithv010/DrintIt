package com.ajith.drinkit.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.ajith.drinkit.entity.Category;

public interface CategoryService {

    Category createCategory(
            Category category);

    List<Category> getAllCategories();

    Category getCategoryById(
            Long id);

    Category updateCategory(
            Long id,
            Category category);

    void deleteCategory(
            Long id);

    String uploadCategoryImage(
            MultipartFile image);
}