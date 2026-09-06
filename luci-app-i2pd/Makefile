include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-i2pd
PKG_VERSION:=1.0.0
PKG_RELEASE:=1
PKG_FLAGS:=nonshared

include $(INCLUDE_DIR)/package.mk

define Package/luci-app-i2pd
  SECTION:=luci
  CATEGORY:=LuCI
  SUBMENU:=3. Applications
  TITLE:=LuCI support for i2pd
  DEPENDS:=+i2pd +ucode
  PKGARCH:=all
endef

define Build/Configure
endef

define Build/Compile
endef

define Package/luci-app-i2pd/install
	$(INSTALL_DIR) $(1)/usr/share/luci/menu.d
	$(INSTALL_DATA) ./root/usr/share/luci/menu.d/luci-app-i2pd.json $(1)/usr/share/luci/menu.d/

	$(INSTALL_DIR) $(1)/usr/share/rpcd/acl.d
	$(INSTALL_DATA) ./root/usr/share/rpcd/acl.d/luci-app-i2pd.json $(1)/usr/share/rpcd/acl.d/

	$(INSTALL_DIR) $(1)/usr/share/rpcd/ucode
	$(INSTALL_DATA) ./root/usr/share/rpcd/ucode/i2pd.uc $(1)/usr/share/rpcd/ucode/

	$(INSTALL_DIR) $(1)/etc/uci-defaults
	$(INSTALL_BIN) ./root/etc/uci-defaults/90-luci-app-i2pd $(1)/etc/uci-defaults/

	$(INSTALL_DIR) $(1)/www/luci-static/resources/view/i2pd
	$(INSTALL_DATA) ./root/www/luci-static/resources/view/i2pd/*.js $(1)/www/luci-static/resources/view/i2pd/
endef

$(eval $(call BuildPackage,luci-app-i2pd))
