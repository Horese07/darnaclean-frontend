<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\HeroController;
use App\Http\Controllers\ReviewClientController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Hero API (no prefix for simplicity, or add to v1 if you want)
Route::get('/hero', [HeroController::class, 'show']);

// Routes publiques
Route::prefix('v1')->group(function () {

    // ===== AUTHENTIFICATION =====
    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login', [AuthController::class, 'login']);

        // Routes protégées
        Route::middleware('auth:sanctum')->group(function () {
            Route::get('user', [AuthController::class, 'user']);
            Route::put('user', [AuthController::class, 'updateProfile']);
            Route::put('password', [AuthController::class, 'changePassword']);
            Route::post('logout', [AuthController::class, 'logout']);
            Route::post('logout-all', [AuthController::class, 'logoutAll']);
        });
    });

    // ===== CATALOGUE PRODUITS =====
    Route::prefix('products')->group(function () {
        Route::get('/', [ProductController::class, 'index']);
        Route::get('/featured', [ProductController::class, 'featured']);
        Route::get('/on-sale', [ProductController::class, 'onSale']);
        Route::get('/search', [ProductController::class, 'search']);
        Route::get('/{slug}', [ProductController::class, 'show']);
    });

    // ===== CATÉGORIES =====
    Route::prefix('categories')->group(function () {
        Route::get('/', [CategoryController::class, 'index']);
        Route::get('/featured', [CategoryController::class, 'featured']);
        Route::get('/{categorySlug}', [CategoryController::class, 'show']);
        Route::get('/{categorySlug}/subcategories', [CategoryController::class, 'subcategories']);
        Route::get('/{categorySlug}/subcategories/{subcategorySlug}', [CategoryController::class, 'showSubcategory']);
        Route::get('/{categorySlug}/breadcrumb', [CategoryController::class, 'breadcrumb']);
        Route::get('/{categorySlug}/{subcategorySlug}/breadcrumb', [CategoryController::class, 'breadcrumb']);
    });

    // ===== PANIER =====
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'index']);
        Route::post('/add', [CartController::class, 'add']);
        Route::put('/{itemId}', [CartController::class, 'update']);
        Route::delete('/{itemId}', [CartController::class, 'remove']);
        Route::delete('/', [CartController::class, 'clear']);

        // Migration panier session vers utilisateur
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/migrate', [CartController::class, 'migrate']);
        });
    });

    // ===== COMMANDES =====
    Route::prefix('orders')->group(function () {
        // Suivi public (pour invités)
        Route::post('/track', [OrderController::class, 'track']);

        // Routes protégées
        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/', [OrderController::class, 'index']);
            Route::post('/', [OrderController::class, 'store']);
            Route::get('/{id}', [OrderController::class, 'show']);
            Route::put('/{id}/cancel', [OrderController::class, 'cancel']);
        });
    });

    // ===== PAIEMENTS =====
    Route::prefix('payments')->group(function () {
        // Webhooks publics
        Route::post('/stripe/webhook', [PaymentController::class, 'stripeWebhook']);
        Route::post('/paypal/webhook', [PaymentController::class, 'paypalWebhook']);

        // Routes protégées
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/stripe/intent', [PaymentController::class, 'createStripeIntent']);
            Route::post('/paypal/create', [PaymentController::class, 'createPaypalOrder']);
            Route::post('/paypal/capture', [PaymentController::class, 'capturePaypalOrder']);
            Route::post('/{paymentId}/confirm', [PaymentController::class, 'confirmPayment']);
        });
    });

    // ===== ROUTES UTILISATEUR AUTHENTIFIÉ =====
    Route::middleware('auth:sanctum')->group(function () {

        // FAVORIS
        Route::prefix('favorites')->group(function () {
            Route::get('/', [FavoriteController::class, 'index']);
            Route::post('/{productId}', [FavoriteController::class, 'add']);
            Route::delete('/{productId}', [FavoriteController::class, 'remove']);
            Route::post('/{productId}/toggle', [FavoriteController::class, 'toggle']);
        });

        // AVIS PRODUITS
        Route::prefix('reviews')->group(function () {
            Route::get('/my-reviews', [ReviewController::class, 'myReviews']);
            Route::post('/products/{productId}', [ReviewController::class, 'store']);
            Route::put('/{reviewId}', [ReviewController::class, 'update']);
            Route::delete('/{reviewId}', [ReviewController::class, 'destroy']);
            Route::post('/{reviewId}/helpful', [ReviewController::class, 'markHelpful']);
        });

        // PROFIL UTILISATEUR
        Route::prefix('user')->group(function () {
            Route::get('/dashboard', [UserController::class, 'dashboard']);

            // Adresses de livraison
            Route::prefix('addresses')->group(function () {
                Route::get('/', [UserController::class, 'addresses']);
                Route::post('/', [UserController::class, 'storeAddress']);
                Route::get('/{id}', [UserController::class, 'showAddress']);
                Route::put('/{id}', [UserController::class, 'updateAddress']);
                Route::delete('/{id}', [UserController::class, 'destroyAddress']);
                Route::put('/{id}/set-default', [UserController::class, 'setDefaultAddress']);
            });

            // Statistiques
            Route::get('/stats', [UserController::class, 'stats']);
        });
    });

    // ===== AVIS PRODUITS (public) =====
    Route::prefix('products/{productId}/reviews')->group(function () {
        Route::get('/', [ReviewController::class, 'index']);
        Route::get('/stats', [ReviewController::class, 'stats']);
    });

    // ===== UTILITAIRES =====
    Route::prefix('utils')->group(function () {
        Route::get('/delivery-zones', function () {
            return response()->json([
                'success' => true,
                'data' => \App\Models\DeliveryZone::active()->ordered()->get()
            ]);
        });

        Route::get('/app-config', function () {
            return response()->json([
                'success' => true,
                'data' => [
                    'languages' => ['fr', 'ar', 'en'],
                    'default_language' => 'fr',
                    'currency' => 'MAD',
                    'free_shipping_threshold' => 200,
                    'tax_rate' => 0.20,
                    'payment_methods' => [
                        'card' => 'Carte bancaire',
                        'paypal' => 'PayPal',
                        'cash_on_delivery' => 'Paiement à la livraison'
                    ]
                ]
            ]);
        });
    });

    // ===== HERO =====
    Route::get('/hero', [HeroController::class, 'show']);
});

// Route fallback pour API
Route::fallback(function () {
    return response()->json([
        'success' => false,
        'message' => 'Endpoint non trouvé',
        'error' => 'La route demandée n\'existe pas.'
    ], 404);
});

// Route::get('/v1/products', [ProductController::class, 'index']);

// Client Reviews
Route::get('/reviews', [ReviewClientController::class, 'index']);
