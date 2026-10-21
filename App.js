import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
const PROFILE_STORAGE_KEY = '@little-lemon/food-ordering-profile-v1';
const CATEGORY_ORDER = ['Starters', 'Mains', 'Desserts', 'Drinks'];

const logo = require('./assets/little-lemon.png');
const heroImage = require('./assets/hero-bruschetta.png');

const MENU_ITEMS = [
  {
    id: 'greek-salad',
    name: 'Greek Salad',
    description: 'Crisp lettuce, peppers, olives, feta, and our house vinaigrette.',
    price: '$12.99',
    category: 'Starters',
    imageUri:
      'https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/greekSalad.jpg?raw=true',
    emoji: '🥗',
  },
  {
    id: 'bruschetta',
    name: 'Bruschetta',
    description: 'Toasted bread topped with tomato, basil, garlic, and parmesan.',
    price: '$7.99',
    category: 'Starters',
    localImage: heroImage,
    emoji: '🍅',
  },
  {
    id: 'hummus',
    name: 'Hummus',
    description: 'Creamy chickpea dip with olive oil, paprika, and warm pita.',
    price: '$8.49',
    category: 'Starters',
    emoji: '🫓',
  },
  {
    id: 'grilled-fish',
    name: 'Grilled Fish',
    description: 'Catch of the day with red onion, crisp capers, and lemon.',
    price: '$20.00',
    category: 'Mains',
    imageUri:
      'https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/grilledFish.jpg?raw=true',
    emoji: '🐟',
  },
  {
    id: 'lemon-chicken',
    name: 'Lemon Herb Chicken',
    description: 'Grilled chicken with oregano, roasted vegetables, and lemon.',
    price: '$18.50',
    category: 'Mains',
    emoji: '🍋',
  },
  {
    id: 'pasta',
    name: 'Pasta',
    description: 'Penne with tomato, aubergine, fresh basil, and salted ricotta.',
    price: '$18.99',
    category: 'Mains',
    imageUri:
      'https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/pasta.jpg?raw=true',
    emoji: '🍝',
  },
  {
    id: 'lemon-dessert',
    name: 'Lemon Dessert',
    description: 'Light, fluffy homemade Italian lemon ricotta cake.',
    price: '$6.99',
    category: 'Desserts',
    imageUri:
      'https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/lemonDessert%202.jpg?raw=true',
    emoji: '🍰',
  },
  {
    id: 'tiramisu',
    name: 'Tiramisu',
    description: 'Espresso-soaked ladyfingers layered with mascarpone cream.',
    price: '$7.49',
    category: 'Desserts',
    emoji: '☕',
  },
  {
    id: 'baklava',
    name: 'Baklava',
    description: 'Crisp filo pastry, toasted nuts, and orange blossom syrup.',
    price: '$6.49',
    category: 'Desserts',
    emoji: '🥮',
  },
  {
    id: 'lemonade',
    name: 'Fresh Lemonade',
    description: 'Freshly pressed lemons, sparkling water, and mint.',
    price: '$4.99',
    category: 'Drinks',
    emoji: '🍋',
  },
  {
    id: 'iced-tea',
    name: 'Iced Tea',
    description: 'Black tea steeped with citrus and served over ice.',
    price: '$3.99',
    category: 'Drinks',
    emoji: '🧊',
  },
  {
    id: 'sparkling-water',
    name: 'Sparkling Water',
    description: 'Chilled mineral water with a slice of lemon.',
    price: '$2.99',
    category: 'Drinks',
    emoji: '💧',
  },
];

function createSelectedCategories() {
  return CATEGORY_ORDER.reduce((categories, category) => {
    categories[category] = true;
    return categories;
  }, {});
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function BrandLogo({ compact = false }) {
  return (
    <View style={[styles.brandLogo, compact && styles.brandLogoCompact]}>
      <Image accessibilityLabel="Little Lemon logo" source={logo} style={styles.logoImage} />
      {compact ? <Text style={styles.brandWordmark}>LITTLE LEMON</Text> : null}
    </View>
  );
}

function AppLoadingScreen() {
  return (
    <SafeAreaView style={styles.loadingScreen}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <BrandLogo />
      <ActivityIndicator color="#495E57" size="large" style={styles.loadingSpinner} />
      <Text style={styles.loadingLabel}>Preparing Little Lemon...</Text>
    </SafeAreaView>
  );
}

function Hero({ searchText, onSearchTextChange, compact = false }) {
  return (
    <View style={[styles.hero, compact && styles.heroCompact]}>
      <View style={styles.heroTextColumn}>
        <Text style={styles.heroTitle}>Little Lemon</Text>
        <Text style={styles.heroLocation}>Chicago</Text>
        <Text numberOfLines={compact ? 4 : 5} style={styles.heroDescription}>
          We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
        </Text>
      </View>
      <Image accessibilityLabel="Bruschetta appetizer" source={heroImage} style={styles.heroImage} />
      {!compact ? (
        <View style={styles.searchContainer}>
          <Text accessibilityElementsHidden style={styles.searchGlyph}>
            {'\u2315'}
          </Text>
          <TextInput
            accessibilityLabel="Search the menu"
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
            onChangeText={onSearchTextChange}
            placeholder="Search menu"
            placeholderTextColor="#65736D"
            returnKeyType="search"
            style={styles.searchInput}
            value={searchText}
          />
        </View>
      ) : null}
    </View>
  );
}

function OnboardingScreen({ onComplete }) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const canContinue = firstName.trim().length > 0 && isValidEmail(email);

  const handleNext = async () => {
    if (!canContinue || isSaving) return;

    setIsSaving(true);
    try {
      await onComplete({
        firstName: firstName.trim(),
        lastName: '',
        email: email.trim().toLowerCase(),
        phone: '',
      });
    } catch (error) {
      Alert.alert('Unable to save your details', 'Please try again.');
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.onboardingContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <BrandLogo compact />
          <Hero compact />
          <View style={styles.formSection}>
            <Text style={styles.formTitle}>Welcome to Little Lemon</Text>
            <Text style={styles.formIntro}>Enter your details to explore the menu and order your favorites.</Text>
            <Text style={styles.inputLabel}>Name *</Text>
            <TextInput
              accessibilityLabel="Name"
              autoCapitalize="words"
              autoCorrect={false}
              onChangeText={setFirstName}
              placeholder="Your name"
              placeholderTextColor="#7D8783"
              style={styles.input}
              textContentType="name"
              value={firstName}
            />
            <Text style={styles.inputLabel}>Email *</Text>
            <TextInput
              accessibilityLabel="Email"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#7D8783"
              style={styles.input}
              textContentType="emailAddress"
              value={email}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: !canContinue || isSaving }}
              disabled={!canContinue || isSaving}
              onPress={handleNext}
              style={({ pressed }) => [
                styles.primaryButton,
                (!canContinue || isSaving) && styles.primaryButtonDisabled,
                pressed && canContinue && !isSaving && styles.pressed,
              ]}
            >
              <Text style={styles.primaryButtonText}>{isSaving ? 'Saving...' : 'Next'}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function MenuThumbnail({ item }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (item.localImage) {
    return <Image accessibilityLabel={`${item.name} dish`} source={item.localImage} style={styles.menuThumbnail} />;
  }

  if (item.imageUri && !imageFailed) {
    return (
      <Image
        accessibilityLabel={`${item.name} dish`}
        onError={() => setImageFailed(true)}
        source={{ uri: item.imageUri }}
        style={styles.menuThumbnail}
      />
    );
  }

  return (
    <View accessibilityLabel={`${item.name} dish illustration`} style={styles.menuThumbnailFallback}>
      <Text style={styles.menuThumbnailEmoji}>{item.emoji}</Text>
    </View>
  );
}

function CategoryChips({ selectedCategories, onToggle }) {
  return (
    <View style={styles.menuBreakdown}>
      <Text style={styles.deliveryHeading}>ORDER FOR DELIVERY!</Text>
      <View accessibilityRole="tablist" style={styles.chipRow}>
        {CATEGORY_ORDER.map((category) => {
          const selected = selectedCategories[category];
          return (
            <Pressable
              accessibilityLabel={`Toggle ${category}`}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              key={category}
              onPress={() => onToggle(category)}
              style={({ pressed }) => [
                styles.categoryChip,
                selected && styles.categoryChipSelected,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.categoryChipText, selected && styles.categoryChipTextSelected]}>
                {category}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function FoodMenuItem({ item }) {
  return (
    <View accessibilityLabel={`${item.name}, ${item.description}, ${item.price}`} style={styles.menuItem}>
      <View style={styles.menuItemText}>
        <Text style={styles.menuItemName}>{item.name}</Text>
        <Text numberOfLines={2} style={styles.menuItemDescription}>{item.description}</Text>
        <Text style={styles.menuItemPrice}>{item.price}</Text>
      </View>
      <MenuThumbnail item={item} />
    </View>
  );
}

function HomeScreen({ navigation, profile }) {
  const [searchText, setSearchText] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(createSelectedCategories);

  const visibleMenuItems = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    return MENU_ITEMS.filter((item) => {
      const inSelectedCategory = selectedCategories[item.category];
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);
      return inSelectedCategory && matchesSearch;
    });
  }, [searchText, selectedCategories]);

  const toggleCategory = (category) => {
    setSelectedCategories((current) => ({
      ...current,
      [category]: !current[category],
    }));
  };

  const noCategoriesSelected = !CATEGORY_ORDER.some((category) => selectedCategories[category]);
  const emptyMessage = noCategoriesSelected
    ? 'Select a menu category to see dishes.'
    : searchText.trim()
      ? 'No menu items match your search.'
      : 'No menu items are available right now.';

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.homeHeader}>
        <BrandLogo compact />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open profile"
          onPress={() => navigation.navigate('Profile')}
          style={({ pressed }) => [styles.profileButton, pressed && styles.pressed]}
        >
          <Text style={styles.profileInitial}>{profile.firstName.charAt(0).toUpperCase()}</Text>
        </Pressable>
      </View>
      <FlatList
        contentContainerStyle={styles.menuListContent}
        data={visibleMenuItems}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyMenuText}>{emptyMessage}</Text>}
        ListHeaderComponent={
          <>
            <Hero searchText={searchText} onSearchTextChange={setSearchText} />
            <CategoryChips selectedCategories={selectedCategories} onToggle={toggleCategory} />
            <Text style={styles.menuListHeading}>MENU</Text>
          </>
        }
        renderItem={({ item }) => <FoodMenuItem item={item} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

function ProfileScreen({ profile, onSave, onLogout }) {
  const [firstName, setFirstName] = useState(profile.firstName || '');
  const [lastName, setLastName] = useState(profile.lastName || '');
  const [email, setEmail] = useState(profile.email || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const canSave = firstName.trim().length > 0 && isValidEmail(email);

  const saveChanges = async () => {
    if (!canSave || isSaving) return;

    setIsSaving(true);
    setSavedMessage('');
    try {
      await onSave({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
      });
      setSavedMessage('Your profile has been saved.');
    } catch (error) {
      Alert.alert('Unable to save changes', 'Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const logOut = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await onLogout();
    } catch (error) {
      Alert.alert('Unable to log out', 'Please try again.');
      setIsLoggingOut(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView contentContainerStyle={styles.profileContent} keyboardShouldPersistTaps="handled">
          <View style={styles.profileHero}>
            <View style={styles.profileAvatarLarge}>
              <Text style={styles.profileAvatarLargeText}>{firstName.charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={styles.profileHeading}>Personal information</Text>
            <Text style={styles.profileSubheading}>Keep your Little Lemon details up to date.</Text>
          </View>
          <Text style={styles.inputLabel}>First name *</Text>
          <TextInput
            accessibilityLabel="First name"
            autoCapitalize="words"
            onChangeText={setFirstName}
            placeholder="First name"
            placeholderTextColor="#7D8783"
            style={styles.input}
            value={firstName}
          />
          <Text style={styles.inputLabel}>Last name</Text>
          <TextInput
            accessibilityLabel="Last name"
            autoCapitalize="words"
            onChangeText={setLastName}
            placeholder="Last name"
            placeholderTextColor="#7D8783"
            style={styles.input}
            value={lastName}
          />
          <Text style={styles.inputLabel}>Email *</Text>
          <TextInput
            accessibilityLabel="Email"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#7D8783"
            style={styles.input}
            value={email}
          />
          <Text style={styles.inputLabel}>Phone number</Text>
          <TextInput
            accessibilityLabel="Phone number"
            keyboardType="phone-pad"
            onChangeText={setPhone}
            placeholder="Phone number"
            placeholderTextColor="#7D8783"
            style={styles.input}
            value={phone}
          />
          {savedMessage ? <Text style={styles.savedMessage}>{savedMessage}</Text> : null}
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: !canSave || isSaving }}
            disabled={!canSave || isSaving}
            onPress={saveChanges}
            style={({ pressed }) => [
              styles.primaryButton,
              (!canSave || isSaving) && styles.primaryButtonDisabled,
              pressed && canSave && !isSaving && styles.pressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>{isSaving ? 'Saving...' : 'Save changes'}</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={logOut}
            style={({ pressed }) => [styles.logoutButton, pressed && styles.pressed]}
          >
            <Text style={styles.logoutButtonText}>{isLoggingOut ? 'Logging out...' : 'Log out'}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default function App() {
  const [profile, setProfile] = useState(null);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const rawProfile = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
        if (!rawProfile) return;

        const savedProfile = JSON.parse(rawProfile);
        if (savedProfile && savedProfile.firstName && isValidEmail(savedProfile.email || '')) {
          if (isMounted) setProfile(savedProfile);
        } else {
          await AsyncStorage.removeItem(PROFILE_STORAGE_KEY);
        }
      } catch (error) {
        console.warn('Unable to load the saved Little Lemon profile.', error);
      } finally {
        if (isMounted) setIsHydrating(false);
      }
    };

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const saveProfile = async (nextProfile) => {
    await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(nextProfile));
    setProfile(nextProfile);
  };

  const clearProfile = async () => {
    await AsyncStorage.removeItem(PROFILE_STORAGE_KEY);
    setProfile(null);
  };

  if (isHydrating) return <AppLoadingScreen />;

  const isOnboarded = Boolean(profile);

  return (
    <NavigationContainer>
      <Stack.Navigator
        key={isOnboarded ? 'onboarded' : 'new-user'}
        screenOptions={{
          animation: 'slide_from_right',
          contentStyle: styles.stackContent,
          headerBackTitle: 'Home',
          headerShadowVisible: false,
          headerTintColor: '#495E57',
          headerTitleStyle: styles.stackHeaderTitle,
        }}
      >
        {isOnboarded ? (
          <>
            <Stack.Screen name="Home" options={{ headerShown: false }}>
              {(navigationProps) => <HomeScreen {...navigationProps} profile={profile} />}
            </Stack.Screen>
            <Stack.Screen name="Profile" options={{ title: 'Profile' }}>
              {(navigationProps) => (
                <ProfileScreen
                  {...navigationProps}
                  onLogout={clearProfile}
                  onSave={saveProfile}
                  profile={profile}
                />
              )}
            </Stack.Screen>
          </>
        ) : (
          <Stack.Screen name="Onboarding" options={{ headerShown: false }}>
            {(navigationProps) => <OnboardingScreen {...navigationProps} onComplete={saveProfile} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  stackContent: {
    backgroundColor: '#FFFFFF',
  },
  stackHeaderTitle: {
    color: '#333333',
    fontSize: 17,
    fontWeight: '700',
  },
  screen: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  loadingScreen: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    flex: 1,
    justifyContent: 'center',
    padding: 28,
  },
  loadingSpinner: {
    marginTop: 30,
  },
  loadingLabel: {
    color: '#495E57',
    fontSize: 16,
    marginTop: 14,
  },
  brandLogo: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  brandLogoCompact: {
    justifyContent: 'flex-start',
  },
  logoImage: {
    height: 58,
    resizeMode: 'contain',
    width: 58,
  },
  brandWordmark: {
    color: '#495E57',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.8,
    marginLeft: 8,
  },
  onboardingContent: {
    alignItems: 'stretch',
    paddingBottom: 38,
    width: '100%',
  },
  formSection: {
    alignSelf: 'stretch',
    paddingHorizontal: 24,
    paddingTop: 26,
    width: '100%',
  },
  formTitle: {
    color: '#333333',
    fontSize: 24,
    fontWeight: '700',
  },
  formIntro: {
    alignSelf: 'stretch',
    color: '#5D6964',
    flexShrink: 1,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 22,
    marginTop: 8,
  },
  hero: {
    backgroundColor: '#495E57',
    minHeight: 248,
    paddingBottom: 22,
    paddingHorizontal: 22,
    paddingTop: 24,
    position: 'relative',
  },
  heroCompact: {
    marginTop: 16,
    minHeight: 215,
  },
  heroTextColumn: {
    maxWidth: '60%',
    paddingRight: 8,
  },
  heroTitle: {
    color: '#F4CE14',
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 39,
  },
  heroLocation: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginTop: -1,
  },
  heroDescription: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 19,
    marginTop: 18,
  },
  heroImage: {
    borderRadius: 12,
    height: 137,
    position: 'absolute',
    right: 22,
    resizeMode: 'cover',
    top: 64,
    width: '34%',
  },
  searchContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    flexDirection: 'row',
    height: 48,
    marginTop: 25,
    paddingHorizontal: 14,
  },
  searchGlyph: {
    color: '#333333',
    fontSize: 27,
    lineHeight: 27,
    marginRight: 10,
    transform: [{ rotate: '-20deg' }],
  },
  searchInput: {
    color: '#333333',
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  inputLabel: {
    color: '#495E57',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderColor: '#A8B0AD',
    borderRadius: 8,
    borderWidth: 1,
    color: '#333333',
    fontSize: 16,
    height: 50,
    paddingHorizontal: 14,
    width: '100%',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#495E57',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    marginTop: 28,
  },
  primaryButtonDisabled: {
    backgroundColor: '#C5CBC8',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.72,
  },
  homeHeader: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 74,
    paddingHorizontal: 20,
  },
  profileButton: {
    alignItems: 'center',
    backgroundColor: '#F4CE14',
    borderColor: '#D6AE00',
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  profileInitial: {
    color: '#33473F',
    fontSize: 18,
    fontWeight: '800',
  },
  menuListContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  menuBreakdown: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 20,
    paddingHorizontal: 18,
    paddingTop: 22,
  },
  deliveryHeading: {
    color: '#333333',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.1,
  },
  chipRow: {
    flexDirection: 'row',
    marginHorizontal: -3,
    marginTop: 15,
  },
  categoryChip: {
    alignItems: 'center',
    backgroundColor: '#EDEFEE',
    borderColor: '#D6DCDA',
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 3,
    minHeight: 37,
    paddingHorizontal: 4,
  },
  categoryChipSelected: {
    backgroundColor: '#F4CE14',
    borderColor: '#F4CE14',
  },
  categoryChipText: {
    color: '#495E57',
    fontSize: 11,
    fontWeight: '700',
  },
  categoryChipTextSelected: {
    color: '#333333',
  },
  menuListHeading: {
    borderTopColor: '#E3E6E5',
    borderTopWidth: 1,
    color: '#495E57',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginHorizontal: 18,
    paddingBottom: 9,
    paddingTop: 18,
  },
  menuItem: {
    alignItems: 'center',
    borderBottomColor: '#E7E9E8',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 18,
    minHeight: 120,
    paddingVertical: 13,
  },
  menuItemText: {
    flex: 1,
    paddingRight: 14,
  },
  menuItemName: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '800',
  },
  menuItemDescription: {
    color: '#66726D',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 5,
  },
  menuItemPrice: {
    color: '#495E57',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 7,
  },
  menuThumbnail: {
    borderRadius: 8,
    height: 82,
    resizeMode: 'cover',
    width: 82,
  },
  menuThumbnailFallback: {
    alignItems: 'center',
    backgroundColor: '#EDEFEE',
    borderRadius: 8,
    height: 82,
    justifyContent: 'center',
    width: 82,
  },
  menuThumbnailEmoji: {
    fontSize: 34,
  },
  emptyMenuText: {
    color: '#66726D',
    fontSize: 16,
    lineHeight: 23,
    paddingHorizontal: 28,
    paddingTop: 28,
    textAlign: 'center',
  },
  profileContent: {
    alignItems: 'stretch',
    padding: 24,
    paddingBottom: 42,
    width: '100%',
  },
  profileHero: {
    alignItems: 'center',
    backgroundColor: '#EDEFEE',
    borderRadius: 14,
    marginBottom: 12,
    paddingBottom: 22,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileAvatarLarge: {
    alignItems: 'center',
    backgroundColor: '#F4CE14',
    borderColor: '#D6AE00',
    borderRadius: 38,
    borderWidth: 1,
    height: 76,
    justifyContent: 'center',
    width: 76,
  },
  profileAvatarLargeText: {
    color: '#33473F',
    fontSize: 31,
    fontWeight: '800',
  },
  profileHeading: {
    color: '#333333',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 12,
  },
  profileSubheading: {
    color: '#66726D',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
  savedMessage: {
    color: '#2E6B4C',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  logoutButton: {
    alignItems: 'center',
    borderColor: '#B23A32',
    borderRadius: 8,
    borderWidth: 1,
    height: 50,
    justifyContent: 'center',
    marginTop: 14,
  },
  logoutButtonText: {
    color: '#B23A32',
    fontSize: 16,
    fontWeight: '700',
  },
});
